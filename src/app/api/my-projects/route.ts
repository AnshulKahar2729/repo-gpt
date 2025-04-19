import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/utils/auth';
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {

    // get user
    const token = req.cookies.get('token')?.value;
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = await getUserFromToken(token);
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const projects = await prisma.project.findMany({
        where: { userId: user.id }
    })

    return NextResponse.json({ projects })
}
