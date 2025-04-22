import { QdrantClient } from '@qdrant/js-client-rest'
import { Chunk } from './types'

const client = new QdrantClient({
  url: process.env.QDRANT_URL!,
  apiKey : process.env.QDRANT_API_KEY!
})
const collectionName = 'repos'

export async function storeChunksInVectorDB(repoUrl: string, chunks: Chunk[]) {
  // Check if collection exists, if not create it
  try {
    await client.getCollection(collectionName)
  } catch (e) {
    // Collection doesn't exist, create it
    await client.createCollection(collectionName, {
      vectors: {
        size: chunks[0]?.embedding?.length || 1536, // Use the dimension of the first chunk or default to 1536
        distance: 'Cosine'
      }
    })
  }

  // Batch points for insertion
  const points = chunks.map(chunk => ({
    id: `${repoUrl}-${chunk.chunk_id}`,
    vector: chunk.embedding || [],
    payload: {
      repo: repoUrl,
      file: chunk.file,
      name: chunk.name || '',
      type: chunk.type || '',
      code: chunk.code
    }
  }))

  // Insert points in batches
  if (points.length > 0) {
   const result = await client.upsert(collectionName, {
      points
    })
    console.log('Inserted chunks into Qdrant:', result)
  } else{
    console.log('No chunks to store in Qdrant')
  }
}

export async function searchRelevantChunks(repoUrl: string, queryEmbedding: number[]) {
  try {
    const results = await client.search(collectionName, {
      vector: queryEmbedding,
      limit: 5,
      filter: {
        must: [
          {
            key: 'repo',
            match: {
              value: repoUrl
            }
          }
        ]
      }
    })

    if (!results || results.length === 0) return []

    return results.map((result, idx): Chunk => ({
      code: typeof result.payload?.code === 'string' ? result.payload.code : '',
      name: typeof result.payload?.name === 'string' ? result.payload.name : '',
      file: typeof result.payload?.file === 'string' ? result.payload.file : '',
      type: typeof result.payload?.type === 'string' ? result.payload.type : '',
      chunk_id: idx
    }))
  } catch (error) {
    console.error('Error searching in Qdrant:', error)
    return []
  }
}
