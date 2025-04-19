import { chunkFileWithGemini } from '@/lib/chunker'
import { embedChunkWithGemini } from '@/lib/embedder'
import { filterUsefulFiles } from '@/lib/filters'
import { cloneRepoAndGetFiles } from '@/lib/git'
import { rateLimit } from '@/lib/rateLimiter'
import { storeChunksInVectorDB } from '@/lib/vector'
import { NextRequest, NextResponse } from 'next/server'
import { getUserFromToken } from '@/utils/auth';
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { repoUrl } = await req.json()
  if (!repoUrl) return NextResponse.json({ error: 'Missing repo URL' }, { status: 400 })

  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  console.log(token)
  const user = await getUserFromToken(token);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const repoName = repoUrl.split('/').slice(-1)[0]

  // Create or update the project in the database
  const project = await prisma.project.upsert({
    where: {
      repoUrl_userId: {
        repoUrl,
        userId: user.id
      }
    },
    update: { name: repoName },
    create: {
      repoUrl,
      name: repoName,
      userId: user.id
    }
  })


  // Pass userId and projectId to the clone function
  const files = await cloneRepoAndGetFiles(repoUrl, user.id, project.id)
  const usefulFiles = filterUsefulFiles(files)

  const allChunks = []

  for (const file of usefulFiles) {
    try {
      // Apply rate limiting before calling Gemini for chunking
      await rateLimit()
      const chunks = await chunkFileWithGemini(file)
      
      for (const chunk of chunks) {
        console.log({ chunk })
        // Apply rate limiting before calling Gemini for embedding
        await rateLimit()
        const embedding = await embedChunkWithGemini(chunk.code)
        allChunks.push({ ...chunk, embedding })
      }
    } catch (error) {
      console.error(`Error processing file ${file.path}:`, error)
      // Continue with next file instead of failing the entire process
    }
  }

  await storeChunksInVectorDB(repoUrl, allChunks)

  return NextResponse.json({ message: 'Repo processed and stored!' })
}
