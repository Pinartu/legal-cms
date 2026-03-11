import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const media = await prisma.media.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(media);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url, fileName, fileType, altText } = body;

    if (!url || !fileName || !fileType || !altText) {
      return NextResponse.json({ error: 'Missing mandatory fields, including Alt Text' }, { status: 400 });
    }

    const newMedia = await prisma.media.create({
      data: { url, fileName, fileType, altText },
    });

    return NextResponse.json(newMedia, { status: 201 });
  } catch (error) {
    console.error('Error adding media:', error);
    return NextResponse.json({ error: 'Failed to create media' }, { status: 500 });
  }
}
