import { ChromaClient } from 'chromadb'
import { Chunk } from './types'

const client = new ChromaClient({
  path : process.env.CHROMA_URL!,
  
})
const collectionName = 'repos'

export async function storeChunksInVectorDB(repoUrl: string, chunks: Chunk[]) {
  const collection = await client.getOrCreateCollection({
    name: collectionName,
    metadata: { description: 'Repo chunks collection' }
  })

  for (const chunk of chunks) {
    await collection.add({
      ids: [`${repoUrl}-${chunk.chunk_id}`],
      documents: [chunk.code],
      embeddings: [chunk.embedding || []],
      metadatas: [{
        repo: repoUrl,
        file: chunk.file,
        name: chunk.name || '',
        type: chunk.type || ''
      }]
    })
  }
}

export async function searchRelevantChunks(repoUrl: string, queryEmbedding: number[]) {
  const collection = await client.getOrCreateCollection({ name: collectionName })

  const results = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults: 5,
    where: { repo: repoUrl }
  })

  if (!results.documents?.[0]) return []

  return results.documents[0].map((code, idx): Chunk => ({
    code: typeof code === 'string' ? code : '',
    name: typeof results.metadatas?.[0]?.[idx]?.name === 'string'
      ? results.metadatas?.[0]?.[idx]?.name
      : '',
    file: typeof results.metadatas?.[0]?.[idx]?.file === 'string'
      ? results.metadatas?.[0]?.[idx]?.file
      : '',
    type: typeof results.metadatas?.[0]?.[idx]?.type === 'string'
      ? results.metadatas?.[0]?.[idx]?.type
      : '',
    chunk_id: idx
  }))

}
