import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidateAllPages } from '@/lib/revalidate';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Await params if Next.js 15+ strictly requires it (context.params is often a promise in app router now)
    const { id } = await context.params;
    const category = await prisma.category.findUnique({
      where: { id },
    });
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { name, slug, description } = body;

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { name, slug, description },
    });
    revalidateAllPages();
    return NextResponse.json(updatedCategory);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await prisma.category.delete({
       where: { id }
    });
    revalidateAllPages();
    return NextResponse.json({ success: true });
  } catch(error) {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
