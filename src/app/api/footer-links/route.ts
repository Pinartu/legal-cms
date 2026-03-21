import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidateAllPages } from '@/lib/revalidate';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale');

    const links = await prisma.footerLink.findMany({
      where: locale ? { locale } : undefined,
      orderBy: [{ column: 'asc' }, { order: 'asc' }],
    });
    return NextResponse.json(links);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch footer links' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { label, url, column, locale, order, openInNewTab } = body;

    if (!label || !url || !column) {
      return NextResponse.json({ error: 'Label, URL, and column are required' }, { status: 400 });
    }

    const link = await prisma.footerLink.create({
      data: {
        label,
        url,
        column,
        locale: locale || 'tr',
        order: order || 0,
        openInNewTab: openInNewTab || false,
      },
    });

    revalidateAllPages();
    return NextResponse.json(link, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create footer link' }, { status: 500 });
  }
}
