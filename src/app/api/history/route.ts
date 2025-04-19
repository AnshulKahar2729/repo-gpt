// /app/api/history/route.ts

import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/utils/auth';
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    const { repoUrl } = await req.json()

    const token = req.cookies.get('token')?.value;
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = await getUserFromToken(token);
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const project = await prisma.project.findUnique({
        where: {
            repoUrl_userId: {
                repoUrl,
                userId: user.id
            }
        },
        include: {
            messages: true
        }
    })

    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    return NextResponse.json({
        project: {
            name: project.name,
            repoUrl: project.repoUrl
        },
        messages: project.messages
    })
}
