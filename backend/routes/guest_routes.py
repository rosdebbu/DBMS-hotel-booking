from flask import Blueprint, request, jsonify
from datetime import datetime
from db import get_db_connection

guest_bp = Blueprint('guest', __name__)

@guest_bp.route('/api/rooms', methods=['GET'])
def get_rooms():
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM Room")
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
