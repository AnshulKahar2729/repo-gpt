import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export const getUserFromToken = async (token: string) => {
  const JWT_SECRET = process.env.NEXTAUTH_SECRET!;
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET) as { id: string };
    console.log({payload})
  } catch {
    return null;
  }
  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: { id: true, email: true, name: true, image: true },
  });
  console.log({user})
  if (!user) {
    return null;
  }
  return user;
}
  