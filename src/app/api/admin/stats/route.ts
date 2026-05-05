import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET() {
  try {
    const [[revenue]] = await pool.query<RowDataPacket[]>(
      "SELECT SUM(total_amount) as total_revenue FROM Reservation WHERE status != 'Cancelled'"
    );
    const [[bookings]] = await pool.query<RowDataPacket[]>(
      "SELECT COUNT(*) as active_bookings FROM Reservation WHERE status = 'Confirmed'"
    );
    const [topRoomRows] = await pool.query<RowDataPacket[]>(`
      SELECT ro.room_type, COUNT(*) as count 
      FROM Reservation r 
      JOIN Room ro ON r.room_id = ro.room_id 
      GROUP BY ro.room_type 
      ORDER BY count DESC LIMIT 1
    `);

    return NextResponse.json({
      total_revenue: parseFloat(revenue?.total_revenue) || 0,
      active_bookings: bookings?.active_bookings || 0,
      top_room_type: topRoomRows[0]?.room_type || 'N/A',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
