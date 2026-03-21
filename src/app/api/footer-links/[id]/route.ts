import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidateAllPages } from '@/lib/revalidate';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { label, url, column, locale, order, openInNewTab } = body;

    const link = await prisma.footerLink.update({
      where: { id },
      data: { label, url, column, locale, order, openInNewTab },
    });

    revalidateAllPages();
    return NextResponse.json(link);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update footer link' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.footerLink.delete({ where: { id } });

    revalidateAllPages();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete footer link' }, { status: 500 });
  }
}
