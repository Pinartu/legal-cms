import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidateAllPages } from '@/lib/revalidate';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        category: true,
        tags: true,
        faqs: true,
        author: {
          select: { id: true, name: true, profileImage: true }
        }
      }
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const {
      title, slug, content, isPublished, locale, categoryId,
      tagIds, authorId, metaTitle, metaDescription, canonicalUrl, faqs,
      postType, sourceUrl, sourcePlatform, embedCode, sourceTitle, sourceExcerpt,
      sourceAuthor, sourceImageUrl, sourceDate,
      legalDocType, legalJurisdiction, legalRefNumber,
      legalPdfUrl, legalPdfTitle,
      showSourceBlock, showCommentary,
    } = body;

    // Disconnect old tags and connect new ones
    const tagsUpdate = tagIds ? { set: tagIds.map((id: string) => ({ id })) } : undefined;

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title, slug, content, isPublished,
        publishedAt: isPublished ? new Date() : null,
        locale: locale || 'tr',
        categoryId: categoryId || null,
        authorId: authorId || null,
        metaTitle, metaDescription, canonicalUrl,
        postType: postType || 'LEGAL',
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
        tags: tagsUpdate,
        faqs: faqs ? {
          deleteMany: {},
          create: faqs.map((faq: any) => ({
            question: faq.question,
            answer: faq.answer
          }))
        } : undefined
      },
      include: { category: true, tags: true, faqs: true }
    });

    revalidateAllPages();
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await prisma.post.delete({ where: { id } });
    revalidateAllPages();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
