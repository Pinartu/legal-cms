import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, bio: true, profileImage: true },
    orderBy: { name: 'asc' },
  });
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  try {
    const { name, email, bio, profileImage, role } = await request.json();
    if (!name || !email) {
      return NextResponse.json({ error: 'İsim ve e-posta zorunludur' }, { status: 400 });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Bu e-posta zaten kullanılıyor' }, { status: 409 });
    }
    const user = await prisma.user.create({
      data: {
        name,
        email,
        bio: bio || null,
        profileImage: profileImage || null,
        role: role || 'AUTHOR',
        passwordHash: 'not-set',
      },
      select: { id: true, name: true, email: true, role: true, bio: true, profileImage: true },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Yazar oluşturulamadı' }, { status: 500 });
  }
}
