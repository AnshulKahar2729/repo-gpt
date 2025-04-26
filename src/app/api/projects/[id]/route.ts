import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/utils/auth';
import { NextRequest, NextResponse } from 'next/server'
import { Pinecone } from '@pinecone-database/pinecone'

// Initialize Pinecone client
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!
})
const indexName = 'repos'

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Get the project ID from the URL params
  const projectId = (await params).id;

  // Get user from token
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const user = await getUserFromToken(token);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  try {
    // First, get the project to verify ownership and get the repoUrl
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Verify the user owns this project
    if (project.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Delete the project from the database
    // The cascade delete will also remove all associated messages
    await prisma.project.delete({
      where: { id: projectId }
    });

    // Delete the project's vectors from Pinecone
    try {
      // Get the index
      const index = pinecone.index(indexName);
      
      // Delete all vectors with the matching repo metadata
      await index.deleteMany({
        filter: {
          repo: project.repoUrl
        }
      });
      
      console.log(`[API] Deleted vectors for repo: ${project.repoUrl}`);
    } catch (error) {
      console.error(`[API] Error deleting vectors from Pinecone:`, error);
      // We continue even if vector deletion fails
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[API] Error deleting project:`, error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
