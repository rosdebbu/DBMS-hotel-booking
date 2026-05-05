import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function POST(request: NextRequest) {
  const data = await request.json();
  const message = ((data.message as string) || '').toLowerCase().trim();

  try {
    // Intent: list hotels
    if (['hotel', 'hotels', 'properties', 'where can i stay'].some((w) => message.includes(w))) {
      const [hotels] = await pool.query<RowDataPacket[]>('SELECT name, location, rating FROM Hotel ORDER BY rating DESC');
      const lines = hotels.map((h) => `🏨 **${h.name}** — ${h.location} (⭐ ${h.rating})`);
      return NextResponse.json({ reply: 'Here are our hotels:\n' + lines.join('\n') });
    }

    // Intent: available rooms
    if (['room', 'rooms', 'available', 'availability'].some((w) => message.includes(w))) {
      let location = '';
      for (const city of ['mumbai', 'chennai', 'goa', 'delhi']) {
        if (message.includes(city)) { location = city; break; }
      }
      let query = `
        SELECT r.room_type, r.price_per_night, h.name as hotel_name, h.location
        FROM Room r JOIN Hotel h ON r.hotel_id = h.hotel_id
        WHERE r.availability_status = 'Available'
      `;
      const params: string[] = [];
      if (location) {
        query += ' AND LOWER(h.location) LIKE ?';
        params.push(`%${location}%`);
      }
      query += ' ORDER BY r.price_per_night ASC';
      const [rooms] = await pool.query<RowDataPacket[]>(query, params);
      if (rooms.length === 0) {
        return NextResponse.json({ reply: "Sorry, no rooms available right now. Try a different city!" });
      }
      const lines = rooms.map((r) => `🛏️ **${r.room_type}** at ${r.hotel_name} (${r.location}) — ₹${r.price_per_night}/night`);
      return NextResponse.json({ reply: `${rooms.length} rooms available:\n` + lines.join('\n') });
    }

    // Intent: price / cheapest / budget
    if (['price', 'cheap', 'budget', 'cost', 'afford', 'lowest'].some((w) => message.includes(w))) {
      const [rooms] = await pool.query<RowDataPacket[]>(`
        SELECT r.room_type, r.price_per_night, h.name as hotel_name, h.location
        FROM Room r JOIN Hotel h ON r.hotel_id = h.hotel_id
        WHERE r.availability_status = 'Available'
        ORDER BY r.price_per_night ASC LIMIT 3
      `);
      const lines = rooms.map((r) => `💰 **${r.room_type}** at ${r.hotel_name} — ₹${r.price_per_night}/night`);
      return NextResponse.json({ reply: 'Here are the most affordable rooms:\n' + lines.join('\n') });
    }

    // Intent: booking status
    if (['booking', 'reservation', 'my booking', 'status', 'confirm'].some((w) => message.includes(w))) {
      const [bookings] = await pool.query<RowDataPacket[]>(`
        SELECT r.booking_id, g.name, ro.room_type, r.status, r.total_amount
        FROM Reservation r
        JOIN Guest g ON r.guest_id = g.guest_id
        JOIN Room ro ON r.room_id = ro.room_id
        ORDER BY r.booking_id DESC LIMIT 5
      `);
      if (bookings.length === 0) {
        return NextResponse.json({ reply: "No bookings found. Would you like to make one? Search for a city on the homepage!" });
      }
      const lines = bookings.map((b) => `📋 Booking #${b.booking_id} — ${b.name} | ${b.room_type} | ${b.status} | ₹${b.total_amount}`);
      return NextResponse.json({ reply: 'Recent bookings:\n' + lines.join('\n') });
    }

    // Intent: services
    if (['service', 'amenity', 'amenities', 'laundry', 'room service'].some((w) => message.includes(w))) {
      const [services] = await pool.query<RowDataPacket[]>('SELECT service_name, cost FROM Service ORDER BY cost ASC');
      const lines = services.map((s) => `✨ **${s.service_name}** — ₹${s.cost}`);
      return NextResponse.json({ reply: 'Available services:\n' + lines.join('\n') });
    }

    // Intent: staff
    if (['staff', 'manager', 'receptionist', 'employee'].some((w) => message.includes(w))) {
      const [staff] = await pool.query<RowDataPacket[]>('SELECT s.name, s.role, h.name as hotel_name FROM Staff s JOIN Hotel h ON s.hotel_id = h.hotel_id');
      const lines = staff.map((s) => `👤 **${s.name}** — ${s.role} at ${s.hotel_name}`);
      return NextResponse.json({ reply: 'Our team:\n' + lines.join('\n') });
    }

    // Intent: help / greeting
    if (['hi', 'hello', 'hey', 'help', 'what can you do'].some((w) => message.includes(w))) {
      return NextResponse.json({
        reply: "👋 Hi! I'm the GoAnywhere assistant. I can help you with:\n• **Hotels** — Ask about our properties\n• **Rooms** — Check available rooms in Mumbai, Chennai, etc.\n• **Prices** — Find the cheapest rooms\n• **Bookings** — View recent booking status\n• **Services** — See laundry, room service & more\n• **Staff** — Know our team\n\nJust type your question!",
      });
    }

    // Fallback
    return NextResponse.json({
      reply: "I'm not sure I understand. Try asking about **hotels**, **rooms**, **prices**, **bookings**, or **services**. Or type **help** to see what I can do!",
    });
  } catch (err: unknown) {
    const message_err = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ reply: `Sorry, I had trouble connecting to the database: ${message_err}` }, { status: 500 });
  }
}
