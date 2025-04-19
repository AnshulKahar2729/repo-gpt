import { Chunk } from "./types"
import { callGemini } from "./gemini"

export async function chunkFileWithGemini(file: { path: string, content: string }): Promise<Chunk[]> {
  const prompt = `
You are an expert code assistant. Chunk the following file into logical code blocks (functions, classes, etc.).
Return a JSON array of objects like:
[{ "name": "functionName", "type": "function", "code": "..." }]

Only return the array. Here's the file:
\`\`\`
${file.content}
\`\`\`
  `
  const response = await callGemini(prompt)
  
  // Extract JSON from markdown if needed
  let jsonContent = response
  
  // Check if response is wrapped in markdown code blocks
  const jsonRegex = /```(?:json)?\s*([\s\S]*?)```/
  const match = response.match(jsonRegex)
  
  if (match && match[1]) {
    jsonContent = match[1].trim()
  }
  
  try {
    const chunks: Chunk[] = JSON.parse(jsonContent)
    return chunks.map((chunk, idx) => ({
      ...chunk,
      file: file.path,
      chunk_id: idx
    }))
  } catch (error: unknown) {
    console.error('Error parsing JSON from Gemini response:', error)
    console.error('Raw response:', response)
    const errorMessage = error instanceof Error ? error.message : String(error)
    throw new Error(`Failed to parse Gemini response as JSON: ${errorMessage}`)
  }
}

export async function askGeminiWithContext(question: string, chunks: Chunk[]): Promise<string> {
  const context = chunks.map(c => c.code).join('\n\n')
  const prompt = `Answer this question using the context below:

Context:
${context}

Question:
${question}
`
  return await callGemini(prompt)
}
