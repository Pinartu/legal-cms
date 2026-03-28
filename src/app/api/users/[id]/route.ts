import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const { name, email, bio, profileImage, role } = await request.json();
    if (!name || !email) {
      return NextResponse.json({ error: 'İsim ve e-posta zorunludur' }, { status: 400 });
    }
    const user = await prisma.user.update({
      where: { id },
      data: { name, email, bio: bio || null, profileImage: profileImage || null, role: role || 'AUTHOR' },
      select: { id: true, name: true, email: true, role: true, bio: true, profileImage: true },
    });
    return NextResponse.json(user);
  } catch (error: any) {
    if (error.code === 'P2002') return NextResponse.json({ error: 'Bu e-posta zaten kullanılıyor' }, { status: 409 });
    return NextResponse.json({ error: 'Güncellenemedi' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    // Unlink posts before deleting
    await prisma.post.updateMany({ where: { authorId: id }, data: { authorId: null } });
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Silinemedi' }, { status: 500 });
  }
}
