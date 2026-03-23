import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidateAllPages } from '@/lib/revalidate';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Yalnızca Prisma şemasında var olan alanları güncelleyelim.
    const link = await prisma.headerLink.update({
      where: { id },
      data: {
        label: body.label,
        url: body.url,
        locale: body.locale,
        order: body.order,
        openInNewTab: body.openInNewTab,
      }
    });
    revalidateAllPages();
    return NextResponse.json(link);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update header link' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.headerLink.delete({ where: { id } });
    revalidateAllPages();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete header link' }, { status: 500 });
  }
}
