import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/utils/auth';
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const projectId = params.id;

  // Get user from token
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await getUserFromToken(token);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Get project and verify ownership
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  if (project.userId !== user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  // Get messages for the project
  const messages = await prisma.message.findMany({
    where: {
      projectId: projectId,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  return NextResponse.json({
    project,
    messages
  });
}
