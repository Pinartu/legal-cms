import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET: Fetch sections for a page
export async function GET(request: NextRequest) {
  const pageId = request.nextUrl.searchParams.get('pageId');
  
  if (!pageId) {
    return NextResponse.json({ error: 'pageId is required' }, { status: 400 });
  }

  const sections = await prisma.pageSection.findMany({
    where: { pageId },
    orderBy: { order: 'asc' },
  });

  return NextResponse.json(sections);
}

// POST: Create a new section
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pageId, type, content, isVisible = true } = body;

    if (!pageId || !type) {
      return NextResponse.json({ error: 'pageId and type are required' }, { status: 400 });
    }

    // Get next order number
    const maxOrder = await prisma.pageSection.aggregate({
      where: { pageId },
      _max: { order: true },
    });

    const section = await prisma.pageSection.create({
      data: {
        pageId,
        type,
        order: (maxOrder._max.order ?? -1) + 1,
        isVisible,
        content: JSON.stringify(content || {}),
      },
    });

    return NextResponse.json(section, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
