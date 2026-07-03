import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') ?? '';
    const categoryId = searchParams.get('categoryId');
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { author: { contains: search } },
        { publisher: { contains: search } },
      ];
    }

    if (categoryId) {
      where.categoryId = Number(categoryId);
    }

    if (from || to) {
      where.publicationDate = {
        ...(from ? { gte: new Date(from) } : {}),
        ...(to ? { lte: new Date(to + 'T23:59:59Z') } : {}),
      };
    }

    const books = await prisma.book.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ data: books });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, author, publicationDate, publisher, numberOfPages, categoryId } = body;

    if (!title || !author || !publicationDate || !publisher || !numberOfPages || !categoryId) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const book = await prisma.book.create({
      data: {
        title,
        author,
        publicationDate: new Date(publicationDate),
        publisher,
        numberOfPages: Number(numberOfPages),
        categoryId: Number(categoryId),
      },
      include: { category: true },
    });

    return NextResponse.json({ data: book }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create book' }, { status: 500 });
  }
}
