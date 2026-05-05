import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: guestId } = await params;

  try {
    await pool.query('DELETE FROM Guest WHERE guest_id = ?', [guestId]);
    return NextResponse.json({ message: 'Guest securely removed.' });
  } catch {
    // If they have existing bookings, the database FK constraints will throw an error
    return NextResponse.json(
      { error: 'Cannot delete guest. They likely have active bookings preventing secure deletion.' },
      { status: 500 }
    );
  }
}
