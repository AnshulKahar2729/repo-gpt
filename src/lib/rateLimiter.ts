import PQueue from 'p-queue'

// Gemini free tier limit is 2 requests per minute per model
const geminiQueue = new PQueue({ interval: 60000, intervalCap: 25 })

// Add a delay between requests and return a promise
export const rateLimit = () => geminiQueue.add(() => new Promise(res => setTimeout(res, 1000)))

// For debugging purposes
geminiQueue.on('active', () => {
  console.log(`Working on item. Size: ${geminiQueue.size} Pending: ${geminiQueue.pending}`)
})

geminiQueue.on('add', () => {
  console.log(`Task added. Size: ${geminiQueue.size} Pending: ${geminiQueue.pending}`)
})
