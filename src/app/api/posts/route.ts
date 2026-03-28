import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidateAllPages } from '@/lib/revalidate';

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
      title, slug, content, isPublished, locale, categoryId,
      tagIds, authorId, metaTitle, metaDescription, canonicalUrl,
      postType, coverImageUrl, sourceUrl, sourcePlatform, embedCode, sourceTitle, sourceExcerpt,
      sourceAuthor, sourceImageUrl, sourceDate,
      legalDocType, legalJurisdiction, legalRefNumber,
      legalPdfUrl, legalPdfTitle,
      showSourceBlock, showCommentary,
    } = body;

    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let resolvedAuthorId: string | null = authorId || null;
    if (resolvedAuthorId) {
      const user = await prisma.user.findUnique({ where: { id: resolvedAuthorId } });
      if (!user) resolvedAuthorId = null;
    }

    const newPost = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        isPublished: isPublished || false,
        publishedAt: isPublished ? new Date() : null,
        locale: locale || 'tr',
        categoryId: categoryId || null,
        authorId: resolvedAuthorId,
        metaTitle,
        metaDescription,
        canonicalUrl,
        postType: postType || 'LEGAL',
        coverImageUrl: coverImageUrl || null,
        sourceUrl: sourceUrl || null,
        sourcePlatform: sourcePlatform || null,
        embedCode: embedCode || null,
        sourceTitle: sourceTitle || null,
        sourceExcerpt: sourceExcerpt || null,
        sourceAuthor: sourceAuthor || null,
        sourceImageUrl: sourceImageUrl || null,
        sourceDate: sourceDate || null,
        legalDocType: legalDocType || null,
        legalJurisdiction: legalJurisdiction || null,
        legalRefNumber: legalRefNumber || null,
        legalPdfUrl: legalPdfUrl || null,
        legalPdfTitle: legalPdfTitle || null,
        showSourceBlock: showSourceBlock !== false,
        showCommentary: showCommentary !== false,
        tags: tagIds ? {
          connect: tagIds.map((id: string) => ({ id }))
        } : undefined
      },
      include: {
        category: true,
        tags: true,
      }
    });

    revalidateAllPages();
    return NextResponse.json(newPost, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Post with this slug already exists' }, { status: 409 });
    }
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
