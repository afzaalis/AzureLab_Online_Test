import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Convert a YYYY-MM-DD string to a Date at noon UTC.
 * Storing/filtering at noon avoids day-shift issues for any timezone (UTC-12 to UTC+14).
 */
function dateOnly(dateStr: string, endOfDay = false): Date {
  // Use noon UTC so the date is correct regardless of the server/client timezone
  return new Date(`${dateStr}T${endOfDay ? '23' : '00'}:00:00.000Z`);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') ?? '';
    const categoryId = searchParams.get('categoryId');
    const from = searchParams.get('from'); // format: YYYY-MM-DD
    const to = searchParams.get('to');     // format: YYYY-MM-DD

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
      // Use ±1 day buffer in the filter to handle both:
      //   1. New books stored at noon UTC (YYYY-MM-DDT12:00:00Z)
      //   2. Old books that were stored with timezone shift (e.g. UTC+7: date - 7h)
      // This ensures filtering by "Published From YYYY-MM-DD" returns all books
      // whose publication date falls on that calendar day in any timezone.
      const fromDate = from ? dateOnly(from) : null;             // YYYY-MM-DDT00:00:00.000Z
      const toDate   = to   ? dateOnly(to, true) : null;         // YYYY-MM-DDT23:00:00.000Z

      // Extend boundaries to absorb timezone offsets up to ±14 hours
      if (fromDate) fromDate.setUTCHours(fromDate.getUTCHours() - 14);
      if (toDate)   toDate.setUTCHours(toDate.getUTCHours() + 14);

      where.publicationDate = {
        ...(fromDate ? { gte: fromDate } : {}),
        ...(toDate   ? { lte: toDate   } : {}),
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

    // Store publicationDate at noon UTC to avoid timezone day-shift issues.
    // e.g. "2025-01-15" → "2025-01-15T12:00:00.000Z" stays within Jan 15 for all timezones.
    const dateStr = publicationDate.split('T')[0]; // accept both YYYY-MM-DD and ISO strings
    const book = await prisma.book.create({
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

    return NextResponse.json({ data: book }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create book' }, { status: 500 });
  }
}
