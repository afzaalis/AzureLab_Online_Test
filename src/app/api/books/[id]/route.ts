import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const book = await prisma.book.findUnique({
      where: { id: Number(id) },
      include: { category: true },
    });

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    return NextResponse.json({ data: book });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch book' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, author, publicationDate, publisher, numberOfPages, categoryId } = body;

    if (!title || !author || !publicationDate || !publisher || !numberOfPages || !categoryId) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Store publicationDate at noon UTC to avoid timezone day-shift issues.
    const dateStr = publicationDate.split('T')[0];
    const book = await prisma.book.update({
      where: { id: Number(id) },
      data: {
        title,
        author,
        publicationDate: new Date(`${dateStr}T12:00:00.000Z`),
        publisher,
        numberOfPages: Number(numberOfPages),
        categoryId: Number(categoryId),
      },
      include: { category: true },
    });

    return NextResponse.json({ data: book });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update book' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await prisma.book.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete book' }, { status: 500 });
  }
}
