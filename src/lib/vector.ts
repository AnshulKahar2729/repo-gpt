import { Pinecone } from '@pinecone-database/pinecone'
import { Chunk } from './types'

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!
})
const indexName = 'repos'

/**
 * Ensures that the Pinecone index exists, creating it if necessary
 * @param dimension - The dimension of the vectors to store (default: 768 for Gemini embeddings)
 */
async function ensureIndexExists(dimension: number = 768): Promise<void> {
  try {
    console.log(`[VECTOR] Checking if index '${indexName}' exists`);
    
    // List all indexes
    const indexes = await pinecone.listIndexes();
    // Check if the index exists in the list
    const indexExists = indexes.indexes?.some((index: { name: string }) => index.name === indexName) || false;
    
    if (!indexExists) {
      console.log(`[VECTOR] Index '${indexName}' does not exist, creating it...`);
      
      // Create the index with the specified dimension
      await pinecone.createIndex({
        name: indexName,
        dimension: dimension,
        metric: 'cosine',
        spec: {
          serverless: {
            cloud: 'aws',
            region: 'us-west-2'
          }
        }
      });
      
      console.log(`[VECTOR] Index '${indexName}' created successfully`);
      
      // Wait for the index to be ready
      console.log(`[VECTOR] Waiting for index to be ready...`);
      let isReady = false;
      let attempts = 0;
      const maxAttempts = 10;
      
      while (!isReady && attempts < maxAttempts) {
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
        
        try {
          const indexDescription = await pinecone.describeIndex(indexName);
          if (indexDescription.status?.ready) {
            isReady = true;
            console.log(`[VECTOR] Index is now ready`);
          } else {
            console.log(`[VECTOR] Index not ready yet, waiting... (Attempt ${attempts}/${maxAttempts})`);
          }
        } catch (error) {
          console.log(`[VECTOR] Error checking index status: ${error}`);
        }
      }
      
      if (!isReady) {
        throw new Error(`Index did not become ready after ${maxAttempts} attempts`);
      }
    } else {
      console.log(`[VECTOR] Index '${indexName}' already exists`);
    }
  } catch (error) {
    console.error(`[VECTOR] Error ensuring index exists:`, error);
    throw error;
  }
}

export async function storeChunksInVectorDB(repoUrl: string, chunks: Chunk[]) {
  try {
    // Ensure the index exists before trying to use it
    const dimension = chunks[0]?.embedding?.length || 768;
    await ensureIndexExists(dimension);
    
    // Get the index
    const index = pinecone.index(indexName);
    
    // Prepare records for upsert
    const records = chunks.map(chunk => ({
      id: `${repoUrl}-${chunk.chunk_id}`,
      values: chunk.embedding || [],
      metadata: {
        repo: repoUrl,
        file: chunk.file,
        name: chunk.name || '',
        type: chunk.type || '',
        code: chunk.code
      }
    }));

    // Insert records in batches
    if (records.length > 0) {
      try {
        console.log(`[VECTOR] Upserting ${records.length} records to Pinecone`);
        const result = await index.upsert(records);
        console.log(`[VECTOR] Inserted chunks into Pinecone:`, result);
      } catch (error) {
        console.error(`[VECTOR] Error inserting chunks into Pinecone:`, error);
        throw error;
      }
    } else {
      console.log('[VECTOR] No chunks to store in Pinecone');
    }
  } catch (error) {
    console.error(`[VECTOR] Error in storeChunksInVectorDB:`, error);
    throw error;
  }
}

export async function searchRelevantChunks(repoUrl: string, queryEmbedding: number[]) {
  try {
    // Ensure the index exists before trying to use it
    await ensureIndexExists(queryEmbedding.length);
    
    const index = pinecone.index(indexName);
    
    console.log(`[VECTOR] Searching for relevant chunks in repo: ${repoUrl}`);
    const results = await index.query({
      vector: queryEmbedding,
      topK: 5,
      filter: {
        repo: repoUrl
      },
      includeMetadata: true
    });

    if (!results.matches || results.matches.length === 0) {
      console.log(`[VECTOR] No matches found for query in repo: ${repoUrl}`);
      return [];
    }

    console.log(`[VECTOR] Found ${results.matches.length} matches for query`);
    return results.matches.map((match, idx): Chunk => ({
      code: typeof match.metadata?.code === 'string' ? match.metadata.code : '',
      name: typeof match.metadata?.name === 'string' ? match.metadata.name : '',
      file: typeof match.metadata?.file === 'string' ? match.metadata.file : '',
      type: typeof match.metadata?.type === 'string' ? match.metadata.type : '',
      chunk_id: idx
    }));
  } catch (error) {
    console.error(`[VECTOR] Error searching in Pinecone:`, error);
    return [];
  }
}
