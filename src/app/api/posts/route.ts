import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const isPublished = searchParams.get('isPublished') === 'true';
  const categoryId = searchParams.get('categoryId');

  try {
    const whereClause: any = {};
    if (searchParams.has('isPublished')) {
      whereClause.isPublished = isPublished;
    }
    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    const posts = await prisma.post.findMany({
      where: whereClause,
      include: {
        category: true,
        tags: true,
        author: {
          select: { id: true, name: true, profileImage: true }
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title, slug, content, isPublished, categoryId,
      tagIds, authorId, metaTitle, metaDescription, canonicalUrl
    } = body;

    if (!title || !slug || !content || !authorId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newPost = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        isPublished: isPublished || false,
        publishedAt: isPublished ? new Date() : null,
        categoryId: categoryId || null,
        authorId,
        metaTitle,
        metaDescription,
        canonicalUrl,
        tags: tagIds ? {
          connect: tagIds.map((id: string) => ({ id }))
        } : undefined
      },
      include: {
        category: true,
        tags: true,
      }
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Post with this slug already exists' }, { status: 409 });
    }
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
