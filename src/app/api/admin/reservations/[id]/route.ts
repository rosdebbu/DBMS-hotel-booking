import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: bookingId } = await params;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [rows] = await connection.query<RowDataPacket[]>(
      'SELECT room_id FROM Reservation WHERE booking_id = ?',
      [bookingId]
    );
    if (rows.length === 0) {
      await connection.rollback();
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    const roomId = rows[0].room_id;

    await connection.query('DELETE FROM Payment WHERE booking_id = ?', [bookingId]);
    await connection.query('DELETE FROM Reservation WHERE booking_id = ?', [bookingId]);
    await connection.query("UPDATE Room SET availability_status = 'Available' WHERE room_id = ?", [roomId]);

    await connection.commit();
    return NextResponse.json({ message: 'Reservation cancelled and Room restored to Available.' });
  } catch (err: unknown) {
    await connection.rollback();
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    connection.release();
  }
}
