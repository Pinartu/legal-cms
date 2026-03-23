import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidateAllPages } from '@/lib/revalidate';

export async function PUT(request: Request, context: any) {
  try {
    const { id } = context.params;
    const body = await request.json();
    
    // Yalnızca Prisma şemasında var olan alanları güncelleyelim. (FooterLink'ten farklı olarak HeaderLink'te 'column' yok)
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

export async function DELETE(request: Request, context: any) {
  try {
    const { id } = context.params;
    await prisma.headerLink.delete({ where: { id } });
    revalidateAllPages();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete header link' }, { status: 500 });
  }
}
