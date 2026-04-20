const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Setup MySQL Connection Pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'Hotel_Management_System',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// GET all rooms
app.get('/api/rooms', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM Room");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET reservations via the View created in the DB
app.get('/api/reservations', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM Guest_Booking_View");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST to book a room and process payment
// This showcases Transactions, Inserts, and Triggers!
app.post('/api/book', async (req, res) => {
    const { name, phone, email, address, id_proof, room_id, price_per_night, check_in, check_out, payment_method } = req.body;
    
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // 1. Calculate new IDs since we didn't use AUTO_INCREMENT in the original schema
        const [[{ maxGuest }]] = await connection.query("SELECT IFNULL(MAX(guest_id), 0) as maxGuest FROM Guest");
        const [[{ maxBooking }]] = await connection.query("SELECT IFNULL(MAX(booking_id), 1000) as maxBooking FROM Reservation");
        const [[{ maxPayment }]] = await connection.query("SELECT IFNULL(MAX(payment_id), 400) as maxPayment FROM Payment");
        
        const guestId = maxGuest + 1;
        const bookingId = maxBooking + 1;
        const paymentId = maxPayment + 1;

        // Calculate amount
        const checkInDate = new Date(check_in);
        const checkOutDate = new Date(check_out);
        const days = Math.max(1, Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)));
        const totalAmount = days * price_per_night;

        // 2. Insert Guest
        await connection.query(
            "INSERT INTO Guest (guest_id, name, phone, email, address, id_proof) VALUES (?, ?, ?, ?, ?, ?)",
            [guestId, name, phone, email, address, id_proof]
        );

        // 3. Insert Reservation 
        // NOTE: Our database TRIGGER 'room_book_trigger' runs automatically here to set Room to Booked!
        await connection.query(
            "INSERT INTO Reservation (booking_id, guest_id, room_id, check_in, check_out, status, total_amount) VALUES (?, ?, ?, ?, ?, 'Confirmed', ?)",
            [bookingId, guestId, room_id, check_in, check_out, totalAmount]
        );

        // 4. Insert Payment
        // Our database TRIGGER 'payment_check' ensures amount is not negative!
        await connection.query(
            "INSERT INTO Payment (payment_id, booking_id, amount, payment_method, payment_status, payment_date) VALUES (?, ?, ?, ?, 'Paid', CURDATE())",
            [paymentId, bookingId, totalAmount, payment_method]
        );

        await connection.commit();
        res.json({ message: "Booking and Payment successful!", booking_id: bookingId });
    } catch (err) {
        if (connection) await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) connection.release();
    }
});

// --- ADMIN API ENDPOINTS ---

// Get all detailed reservations
app.get('/api/admin/reservations', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT r.booking_id, g.name as guest_name, ro.room_type, r.room_id, r.check_in, r.check_out, r.total_amount, r.status, p.payment_method
            FROM Reservation r 
            JOIN Guest g ON r.guest_id = g.guest_id 
            JOIN Room ro ON r.room_id = ro.room_id
            LEFT JOIN Payment p ON r.booking_id = p.booking_id
            ORDER BY r.check_in DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Cancel a reservation and free the room
app.delete('/api/admin/reservations/:id', async (req, res) => {
    const bookingId = req.params.id;
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [rows] = await connection.query("SELECT room_id FROM Reservation WHERE booking_id = ?", [bookingId]);
        if (rows.length === 0) throw new Error("Booking not found");
        const roomId = rows[0].room_id;

        await connection.query("DELETE FROM Payment WHERE booking_id = ?", [bookingId]);
        await connection.query("DELETE FROM Reservation WHERE booking_id = ?", [bookingId]);
        await connection.query("UPDATE Room SET availability_status = 'Available' WHERE room_id = ?", [roomId]);

        await connection.commit();
        res.json({ message: "Reservation cancelled and Room restored to Available." });
    } catch (err) {
        if (connection) await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) connection.release();
    }
});

// Get all guests
app.get('/api/admin/guests', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM Guest ORDER BY guest_id DESC");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a guest
app.delete('/api/admin/guests/:id', async (req, res) => {
    try {
        await pool.query("DELETE FROM Guest WHERE guest_id = ?", [req.params.id]);
        res.json({ message: "Guest securely removed." });
    } catch (err) {
        // If they have existing bookings, the database FK constraints will throw an error to prevent corruption!
        res.status(500).json({ error: "Cannot delete guest. They likely have active bookings preventing secure deletion." });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Hotel Management Server running at http://localhost:${PORT}`);
});
