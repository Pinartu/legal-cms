import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidateAllPages } from '@/lib/revalidate';

export async function GET() {
  try {
    const pages = await prisma.customPage.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(pages);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, slug, content, locale, isPublished, metaTitle, metaDescription } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: 'Title and slug are required' }, { status: 400 });
    }

    const page = await prisma.customPage.create({
      data: {
        title,
        slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        content: content || '',
        locale: locale || 'tr',
        isPublished: isPublished !== false,
        metaTitle,
        metaDescription,
      },
    });

    revalidateAllPages();
    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create page' }, { status: 500 });
  }
}
