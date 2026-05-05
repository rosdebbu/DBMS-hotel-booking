import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function POST(request: NextRequest) {
  const data = await request.json();
  const requiredFields = ['name', 'phone', 'email', 'address', 'id_proof', 'room_id', 'price_per_night', 'check_in', 'check_out', 'payment_method'];

  if (!requiredFields.every((field) => field in data)) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Calculate new IDs since we didn't use AUTO_INCREMENT in the original schema
    const [[{ maxGuest }]] = await connection.query<RowDataPacket[]>('SELECT IFNULL(MAX(guest_id), 0) as maxGuest FROM Guest');
    const [[{ maxBooking }]] = await connection.query<RowDataPacket[]>('SELECT IFNULL(MAX(booking_id), 1000) as maxBooking FROM Reservation');
    const [[{ maxPayment }]] = await connection.query<RowDataPacket[]>('SELECT IFNULL(MAX(payment_id), 400) as maxPayment FROM Payment');

    const guestId = maxGuest + 1;
    const bookingId = maxBooking + 1;
    const paymentId = maxPayment + 1;

    // Calculate amount
    const checkInDate = new Date(data.check_in);
    const checkOutDate = new Date(data.check_out);
    const days = Math.max(1, Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)));
    const totalAmount = days * parseFloat(data.price_per_night);

    // 2. Insert Guest
    await connection.query(
      'INSERT INTO Guest (guest_id, name, phone, email, address, id_proof) VALUES (?, ?, ?, ?, ?, ?)',
      [guestId, data.name, data.phone, data.email, data.address, data.id_proof]
    );

    // 3. Insert Reservation
    // NOTE: Our database TRIGGER 'room_book_trigger' runs automatically here to set Room to Booked!
    await connection.query(
      "INSERT INTO Reservation (booking_id, guest_id, room_id, check_in, check_out, status, total_amount) VALUES (?, ?, ?, ?, ?, 'Confirmed', ?)",
      [bookingId, guestId, data.room_id, data.check_in, data.check_out, totalAmount]
    );

    // 4. Insert Payment
    // Our database TRIGGER 'payment_check' ensures amount is not negative!
    await connection.query(
      "INSERT INTO Payment (payment_id, booking_id, amount, payment_method, payment_status, payment_date) VALUES (?, ?, ?, ?, 'Paid', CURDATE())",
      [paymentId, bookingId, totalAmount, data.payment_method]
    );

    await connection.commit();
    return NextResponse.json({ message: 'Booking and Payment successful!', booking_id: bookingId });
  } catch (err: unknown) {
    await connection.rollback();
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    connection.release();
  }
}
