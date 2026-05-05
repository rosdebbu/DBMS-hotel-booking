import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT r.booking_id, g.name as guest_name, ro.room_type, r.room_id, 
             r.check_in, r.check_out, r.total_amount, r.status, p.payment_method
      FROM Reservation r 
      JOIN Guest g ON r.guest_id = g.guest_id 
      JOIN Room ro ON r.room_id = ro.room_id
      LEFT JOIN Payment p ON r.booking_id = p.booking_id
      ORDER BY r.check_in DESC
    `);
    return NextResponse.json(rows);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
