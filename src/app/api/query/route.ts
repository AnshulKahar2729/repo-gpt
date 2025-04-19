import { askGeminiWithContext } from '@/lib/chunker'
import { embedQueryWithGemini } from '@/lib/embedder'
import { searchRelevantChunks } from '@/lib/vector'
import { NextRequest, NextResponse } from 'next/server'
import { getUserFromToken } from '@/utils/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const { repoUrl, query } = await req.json();
  if (!repoUrl || !query) return NextResponse.json({ error: 'Missing data' }, { status: 400 })

  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = await getUserFromToken(token);
  console.log({user})
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const project = await prisma.project.findUnique({
    where: {
      repoUrl_userId: {
        repoUrl,
        userId: user.id
      }
    }
  })

  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const queryEmbedding = await embedQueryWithGemini(query)
  const relevantChunks = await searchRelevantChunks(repoUrl, queryEmbedding)

  const answer = await askGeminiWithContext(query, relevantChunks)

  await prisma.message.create({
    data: {
      projectId: project.id,
      userInput: query,
      response: answer
    }
  })

  return NextResponse.json({ answer })
}
