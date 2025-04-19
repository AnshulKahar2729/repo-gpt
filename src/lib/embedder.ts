import { callGeminiEmbedding } from "@/lib/gemini"
export async function embedChunkWithGemini(text: string): Promise<number[]> {
  return await callGeminiEmbedding(text)
}

export async function embedQueryWithGemini(text: string): Promise<number[]> {
  return await callGeminiEmbedding(text)
}
