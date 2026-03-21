import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { revalidateHomePage } from '@/lib/revalidate';

// PUT: Reorder sections (bulk update order values)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderedIds } = body; // array of section IDs in new order

    if (!Array.isArray(orderedIds)) {
      return NextResponse.json({ error: 'orderedIds array is required' }, { status: 400 });
    }

    // Update each section's order in a transaction
    await prisma.$transaction(
      orderedIds.map((id: string, index: number) =>
        prisma.pageSection.update({
          where: { id },
          data: { order: index },
        })
      )
    );

    revalidateHomePage();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
