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
      title, slug, content, isPublished, categoryId,
      tagIds, metaTitle, metaDescription, canonicalUrl, faqs
    } = body;

    // Disconnect old tags and connect new ones
    const tagsUpdate = tagIds ? { set: tagIds.map((id: string) => ({ id })) } : undefined;

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title, slug, content, isPublished,
        publishedAt: isPublished ? new Date() : null,
        categoryId: categoryId || null,
        metaTitle, metaDescription, canonicalUrl,
        tags: tagsUpdate,
        // Replace all FAQs on update for simplicity
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
