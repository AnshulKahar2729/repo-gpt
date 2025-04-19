import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// Helper function to wait for a specified time
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function callGemini(prompt: string, maxRetries = 3): Promise<string> {
  // Use the correct model name format for Gemini 2.0 Flash-Lite
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' })
  
  let retries = 0
  
  while (retries <= maxRetries) {
    try {
      const result = await model.generateContent(prompt)
      return result.response.text()
    } catch (error: any) {
      console.error('Error calling Gemini API:', error)
      
      // Check if it's a rate limit error (429)
      if (error?.status === 429) {
        retries++
        
        if (retries <= maxRetries) {
          // Get retry delay from error if available, or use exponential backoff
          let retryDelay = 30000 * retries // Default: 30s, 60s, 90s
          
          // Try to extract retry delay from error details if available
          try {
            const errorDetails = error.errorDetails || []
            const retryInfo = errorDetails.find((detail: any) => detail['@type']?.includes('RetryInfo'))
            if (retryInfo?.retryDelay) {
              const delayStr = retryInfo.retryDelay
              // Convert "9s" to 9000 milliseconds
              retryDelay = parseInt(delayStr.replace(/\D/g, '')) * 1000
            }
          } catch (parseError) {
            console.error('Error parsing retry delay:', parseError)
          }
          
          console.log(`Rate limit exceeded. Retrying in ${retryDelay/1000} seconds... (Attempt ${retries}/${maxRetries})`)
          await sleep(retryDelay)
          continue
        }
      }
      
      // If we've exhausted retries or it's not a rate limit error, throw
      throw error
    }
  }
  
  throw new Error('Maximum retries exceeded for Gemini API call')
}

export async function callGeminiEmbedding(text: string, maxRetries = 3): Promise<number[]> {
  // The embedding model name is correct
  const model = genAI.getGenerativeModel({ model: 'embedding-001' })
  
  let retries = 0
  
  while (retries <= maxRetries) {
    try {
      const result = await model.embedContent(text)
      return result.embedding.values
    } catch (error: any) {
      console.error('Error calling Gemini Embedding API:', error)
      
      // Check if it's a rate limit error (429)
      if (error?.status === 429) {
        retries++
        
        if (retries <= maxRetries) {
          // Get retry delay from error if available, or use exponential backoff
          let retryDelay = 30000 * retries // Default: 30s, 60s, 90s
          
          // Try to extract retry delay from error details if available
          try {
            const errorDetails = error.errorDetails || []
            const retryInfo = errorDetails.find((detail: any) => detail['@type']?.includes('RetryInfo'))
            if (retryInfo?.retryDelay) {
              const delayStr = retryInfo.retryDelay
              // Convert "9s" to 9000 milliseconds
              retryDelay = parseInt(delayStr.replace(/\D/g, '')) * 1000
            }
          } catch (parseError) {
            console.error('Error parsing retry delay:', parseError)
          }
          
          console.log(`Rate limit exceeded. Retrying in ${retryDelay/1000} seconds... (Attempt ${retries}/${maxRetries})`)
          await sleep(retryDelay)
          continue
        }
      }
      
      // If we've exhausted retries or it's not a rate limit error, throw
      throw error
    }
  }
  
  throw new Error('Maximum retries exceeded for Gemini Embedding API call')
}