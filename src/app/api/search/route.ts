import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  const location = request.nextUrl.searchParams.get('location') || '';

  try {
    let query = `
      SELECT r.*, h.name as hotel_name, h.location, h.rating 
      FROM Room r
      JOIN Hotel h ON r.hotel_id = h.hotel_id
      WHERE r.availability_status = 'Available'
    `;
    const params: string[] = [];

    if (location) {
      query += ' AND h.location LIKE ?';
      params.push(`%${location}%`);
    }

    const [rows] = await pool.query(query, params);
    return NextResponse.json(rows);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
