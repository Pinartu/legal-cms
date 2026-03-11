import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// PUT: Update a section
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { content, isVisible, order } = body;

    const data: any = {};
    if (content !== undefined) data.content = typeof content === 'string' ? content : JSON.stringify(content);
    if (isVisible !== undefined) data.isVisible = isVisible;
    if (order !== undefined) data.order = order;

    const section = await prisma.pageSection.update({
      where: { id },
      data,
    });

    return NextResponse.json(section);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Remove a section
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.pageSection.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
