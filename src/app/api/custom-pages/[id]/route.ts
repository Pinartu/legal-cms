import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidateAllPages } from '@/lib/revalidate';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const page = await prisma.customPage.findUnique({ where: { id } });
    if (!page) return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    return NextResponse.json(page);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch page' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, slug, content, locale, isPublished, metaTitle, metaDescription } = body;

    const page = await prisma.customPage.update({
      where: { id },
      data: {
        title,
        slug: slug?.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        content,
        locale,
        isPublished,
        metaTitle,
        metaDescription,
      },
    });

    revalidateAllPages();
    return NextResponse.json(page);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update page' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.customPage.delete({ where: { id } });

    revalidateAllPages();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 });
  }
}
