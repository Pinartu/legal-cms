import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidateAllPages } from '@/lib/revalidate';

export async function GET() {
  try {
    const links = await prisma.headerLink.findMany({
      orderBy: [{ locale: 'asc' }, { order: 'asc' }]
    });
    return NextResponse.json(links);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch header links' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const link = await prisma.headerLink.create({
      data: {
        label: body.label,
        url: body.url,
        locale: body.locale || 'tr',
        order: body.order || 0,
        openInNewTab: body.openInNewTab || false,
      }
    });
    revalidateAllPages();
    return NextResponse.json(link);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create header link' }, { status: 500 });
  }
}
