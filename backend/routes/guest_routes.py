from flask import Blueprint, request, jsonify
from datetime import datetime
from db import get_db_connection

guest_bp = Blueprint('guest', __name__)

@guest_bp.route('/api/rooms', methods=['GET'])
def get_rooms():
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            query = """
                SELECT r.*, h.name as hotel_name, h.location, h.rating 
                FROM Room r
                JOIN Hotel h ON r.hotel_id = h.hotel_id
            """
            cursor.execute(query)
            rooms = cursor.fetchall()
            return jsonify(rooms)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@guest_bp.route('/api/reservations', methods=['GET'])
def get_reservations():
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM Guest_Booking_View")
            reservations = cursor.fetchall()
            return jsonify(reservations)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@guest_bp.route('/api/search', methods=['GET'])
def search_rooms():
    location = request.args.get('location', '')
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            query = """
                SELECT r.*, h.name as hotel_name, h.location, h.rating 
                FROM Room r
                JOIN Hotel h ON r.hotel_id = h.hotel_id
                WHERE r.availability_status = 'Available'
            """
            params = []
            if location:
                query += " AND h.location LIKE %s"
                params.append(f"%{location}%")
                
            cursor.execute(query, tuple(params))
            rooms = cursor.fetchall()
            return jsonify(rooms)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@guest_bp.route('/api/book', methods=['POST'])
def book_room():
    data = request.json
    required_fields = ['name', 'phone', 'email', 'address', 'id_proof', 'room_id', 'price_per_night', 'check_in', 'check_out', 'payment_method']
    
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            # 1. Calculate new IDs
            cursor.execute("SELECT IFNULL(MAX(guest_id), 0) as maxGuest FROM Guest")
            guest_id = cursor.fetchone()['maxGuest'] + 1
            
            cursor.execute("SELECT IFNULL(MAX(booking_id), 1000) as maxBooking FROM Reservation")
            booking_id = cursor.fetchone()['maxBooking'] + 1
            
            cursor.execute("SELECT IFNULL(MAX(payment_id), 400) as maxPayment FROM Payment")
            payment_id = cursor.fetchone()['maxPayment'] + 1

            # Calculate amount
            check_in_date = datetime.strptime(data['check_in'], '%Y-%m-%d')
            check_out_date = datetime.strptime(data['check_out'], '%Y-%m-%d')
            days = max(1, (check_out_date - check_in_date).days)
            total_amount = days * float(data['price_per_night'])

            # 2. Insert Guest
            cursor.execute(
                "INSERT INTO Guest (guest_id, name, phone, email, address, id_proof) VALUES (%s, %s, %s, %s, %s, %s)",
                (guest_id, data['name'], data['phone'], data['email'], data['address'], data['id_proof'])
            )

            # 3. Insert Reservation
            cursor.execute(
                "INSERT INTO Reservation (booking_id, guest_id, room_id, check_in, check_out, status, total_amount) VALUES (%s, %s, %s, %s, %s, 'Confirmed', %s)",
                (booking_id, guest_id, data['room_id'], data['check_in'], data['check_out'], total_amount)
            )

            # 4. Insert Payment
            cursor.execute(
                "INSERT INTO Payment (payment_id, booking_id, amount, payment_method, payment_status, payment_date) VALUES (%s, %s, %s, %s, 'Paid', CURDATE())",
                (payment_id, booking_id, total_amount, data['payment_method'])
            )

        conn.commit()
        return jsonify({"message": "Booking and Payment successful!", "booking_id": booking_id})
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@guest_bp.route('/api/chatbot', methods=['POST'])
def chatbot():
    """Smart chatbot that queries the Hotel_Management_System database."""
    data = request.json
    message = (data.get('message', '') or '').lower().strip()

    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            # Intent: list hotels
            if any(w in message for w in ['hotel', 'hotels', 'properties', 'where can i stay']):
                cursor.execute("SELECT name, location, rating FROM Hotel ORDER BY rating DESC")
                hotels = cursor.fetchall()
                lines = [f"🏨 **{h['name']}** — {h['location']} (⭐ {h['rating']})" for h in hotels]
                return jsonify({'reply': "Here are our hotels:\n" + "\n".join(lines)})

            # Intent: available rooms
            if any(w in message for w in ['room', 'rooms', 'available', 'availability']):
                location = ''
                for city in ['mumbai', 'chennai', 'goa', 'delhi']:
                    if city in message:
                        location = city
                        break
                query = """
                    SELECT r.room_type, r.price_per_night, h.name as hotel_name, h.location
                    FROM Room r JOIN Hotel h ON r.hotel_id = h.hotel_id
                    WHERE r.availability_status = 'Available'
                """
                params = []
                if location:
                    query += " AND LOWER(h.location) LIKE %s"
                    params.append(f"%{location}%")
                query += " ORDER BY r.price_per_night ASC"
                cursor.execute(query, tuple(params))
                rooms = cursor.fetchall()
                if not rooms:
                    return jsonify({'reply': "Sorry, no rooms available right now. Try a different city!"})
                lines = [f"🛏️ **{r['room_type']}** at {r['hotel_name']} ({r['location']}) — ₹{r['price_per_night']}/night" for r in rooms]
                return jsonify({'reply': f"{len(rooms)} rooms available:\n" + "\n".join(lines)})

            # Intent: price / cheapest / budget
            if any(w in message for w in ['price', 'cheap', 'budget', 'cost', 'afford', 'lowest']):
                cursor.execute("""
                    SELECT r.room_type, r.price_per_night, h.name as hotel_name, h.location
                    FROM Room r JOIN Hotel h ON r.hotel_id = h.hotel_id
                    WHERE r.availability_status = 'Available'
                    ORDER BY r.price_per_night ASC LIMIT 3
                """)
                rooms = cursor.fetchall()
                lines = [f"💰 **{r['room_type']}** at {r['hotel_name']} — ₹{r['price_per_night']}/night" for r in rooms]
                return jsonify({'reply': "Here are the most affordable rooms:\n" + "\n".join(lines)})

            # Intent: booking status
            if any(w in message for w in ['booking', 'reservation', 'my booking', 'status', 'confirm']):
                cursor.execute("""
                    SELECT r.booking_id, g.name, ro.room_type, r.status, r.total_amount
                    FROM Reservation r
                    JOIN Guest g ON r.guest_id = g.guest_id
                    JOIN Room ro ON r.room_id = ro.room_id
                    ORDER BY r.booking_id DESC LIMIT 5
                """)
                bookings = cursor.fetchall()
                if not bookings:
                    return jsonify({'reply': "No bookings found. Would you like to make one? Search for a city on the homepage!"})
                lines = [f"📋 Booking #{b['booking_id']} — {b['name']} | {b['room_type']} | {b['status']} | ₹{b['total_amount']}" for b in bookings]
                return jsonify({'reply': "Recent bookings:\n" + "\n".join(lines)})

            # Intent: services
            if any(w in message for w in ['service', 'amenity', 'amenities', 'laundry', 'room service']):
                cursor.execute("SELECT service_name, cost FROM Service ORDER BY cost ASC")
                services = cursor.fetchall()
                lines = [f"✨ **{s['service_name']}** — ₹{s['cost']}" for s in services]
                return jsonify({'reply': "Available services:\n" + "\n".join(lines)})

            # Intent: staff
            if any(w in message for w in ['staff', 'manager', 'receptionist', 'employee']):
                cursor.execute("SELECT s.name, s.role, h.name as hotel_name FROM Staff s JOIN Hotel h ON s.hotel_id = h.hotel_id")
                staff = cursor.fetchall()
                lines = [f"👤 **{s['name']}** — {s['role']} at {s['hotel_name']}" for s in staff]
                return jsonify({'reply': "Our team:\n" + "\n".join(lines)})

            # Intent: help / greeting
            if any(w in message for w in ['hi', 'hello', 'hey', 'help', 'what can you do']):
                return jsonify({'reply': "👋 Hi! I'm the GoAnywhere assistant. I can help you with:\n• **Hotels** — Ask about our properties\n• **Rooms** — Check available rooms in Mumbai, Chennai, etc.\n• **Prices** — Find the cheapest rooms\n• **Bookings** — View recent booking status\n• **Services** — See laundry, room service & more\n• **Staff** — Know our team\n\nJust type your question!"})

            # Fallback
            return jsonify({'reply': "I'm not sure I understand. Try asking about **hotels**, **rooms**, **prices**, **bookings**, or **services**. Or type **help** to see what I can do!"})

    except Exception as e:
        return jsonify({'reply': f"Sorry, I had trouble connecting to the database: {str(e)}"}), 500
    finally:
        conn.close()

