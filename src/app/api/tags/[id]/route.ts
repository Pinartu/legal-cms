import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePosts } from '@/lib/revalidate';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const tag = await prisma.tag.findUnique({
      where: { id },
    });
    if (!tag) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
    }
    return NextResponse.json(tag);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tag' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { name, slug } = await request.json();

    const updatedTag = await prisma.tag.update({
      where: { id },
      data: { name, slug },
    });
    revalidatePosts();
    return NextResponse.json(updatedTag);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update tag' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await prisma.tag.delete({ where: { id } });
    revalidatePosts();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete tag' }, { status: 500 });
  }
}
