const mysql = require('mysql2/promise');

async function seedDestinations() {
  const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '1234',
    database: process.env.MYSQL_DB || 'Hotel_Management_System',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  try {
    console.log('Adding hotels for Udaipur, Goa, Delhi, and Jaipur...');
    
    // First, let's get the max hotel_id to ensure we don't collide
    const [hRows] = await pool.query('SELECT MAX(hotel_id) as maxId FROM Hotel');
    let hId = (hRows[0].maxId || 0) + 1;
    
    // Hotels to insert
    const hotels = [
      { id: hId++, name: 'Taj Lake Palace', location: 'Udaipur, India', contact: '9876543221', rating: 4.9 },
      { id: hId++, name: 'The Oberoi Udaivilas', location: 'Udaipur, India', contact: '9876543222', rating: 4.8 },
      { id: hId++, name: 'Taj Exotica Resort & Spa', location: 'Goa, India', contact: '9876543223', rating: 4.7 },
      { id: hId++, name: 'W Goa', location: 'Goa, India', contact: '9876543224', rating: 4.6 },
      { id: hId++, name: 'The Leela Palace', location: 'Delhi, India', contact: '9876543225', rating: 4.8 },
      { id: hId++, name: 'ITC Maurya', location: 'Delhi, India', contact: '9876543226', rating: 4.5 },
      { id: hId++, name: 'Rambagh Palace', location: 'Jaipur, India', contact: '9876543227', rating: 4.9 },
      { id: hId++, name: 'Fairmont Jaipur', location: 'Jaipur, India', contact: '9876543228', rating: 4.7 }
    ];

    for (const h of hotels) {
      await pool.query(
        'INSERT IGNORE INTO Hotel (hotel_id, name, location, contact, rating) VALUES (?, ?, ?, ?, ?)',
        [h.id, h.name, h.location, h.contact, h.rating]
      );
    }

    // Now let's get max room_id
    const [rRows] = await pool.query('SELECT MAX(room_id) as maxId FROM Room');
    let rId = (rRows[0].maxId || 0) + 1;

    // Rooms for each hotel
    const roomTypes = [
      { type: 'Deluxe', price: 15000 },
      { type: 'Suite', price: 35000 },
      { type: 'Presidential', price: 85000 }
    ];

    for (const h of hotels) {
      for (const rt of roomTypes) {
        // slight price variation per hotel
        const price = rt.price + (Math.floor(Math.random() * 5000));
        await pool.query(
          'INSERT IGNORE INTO Room (room_id, room_type, price_per_night, availability_status, hotel_id) VALUES (?, ?, ?, ?, ?)',
          [rId++, rt.type, price, 'Available', h.id]
        );
      }
    }

    console.log('Successfully seeded database with new hotels and rooms!');
  } catch (err) {
    console.error('Error seeding:', err);
  } finally {
    await pool.end();
  }
}

seedDestinations();
