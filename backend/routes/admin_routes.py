from flask import Blueprint, jsonify
from db import get_db_connection

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/api/admin/reservations', methods=['GET'])
def get_admin_reservations():
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            query = """
                SELECT r.booking_id, g.name as guest_name, ro.room_type, r.room_id, 
                       r.check_in, r.check_out, r.total_amount, r.status, p.payment_method
                FROM Reservation r 
                JOIN Guest g ON r.guest_id = g.guest_id 
                JOIN Room ro ON r.room_id = ro.room_id
                LEFT JOIN Payment p ON r.booking_id = p.booking_id
                ORDER BY r.check_in DESC
            """
            cursor.execute(query)
            reservations = cursor.fetchall()
            # Format datetime objects for JSON serialization
            for res in reservations:
                if 'check_in' in res and res['check_in']:
                    res['check_in'] = res['check_in'].strftime('%Y-%m-%d')
                if 'check_out' in res and res['check_out']:
                    res['check_out'] = res['check_out'].strftime('%Y-%m-%d')
            return jsonify(reservations)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@admin_bp.route('/api/admin/reservations/<int:booking_id>', methods=['DELETE'])
def delete_reservation(booking_id):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT room_id FROM Reservation WHERE booking_id = %s", (booking_id,))
            row = cursor.fetchone()
            if not row:
                return jsonify({'error': 'Booking not found'}), 404
            room_id = row['room_id']

            cursor.execute("DELETE FROM Payment WHERE booking_id = %s", (booking_id,))
            cursor.execute("DELETE FROM Reservation WHERE booking_id = %s", (booking_id,))
            cursor.execute("UPDATE Room SET availability_status = 'Available' WHERE room_id = %s", (room_id,))
            
        conn.commit()
        return jsonify({"message": "Reservation cancelled and Room restored to Available."})
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@admin_bp.route('/api/admin/guests', methods=['GET'])
def get_guests():
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM Guest ORDER BY guest_id DESC")
            guests = cursor.fetchall()
            return jsonify(guests)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@admin_bp.route('/api/admin/guests/<int:guest_id>', methods=['DELETE'])
def delete_guest(guest_id):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("DELETE FROM Guest WHERE guest_id = %s", (guest_id,))
        conn.commit()
        return jsonify({"message": "Guest securely removed."})
    except Exception as e:
        conn.rollback()
        return jsonify({'error': "Cannot delete guest. They likely have active bookings preventing secure deletion."}), 500
    finally:
        conn.close()

@admin_bp.route('/api/admin/stats', methods=['GET'])
def get_admin_stats():
    # Advanced Analytics endpoint
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT SUM(total_amount) as total_revenue FROM Reservation WHERE status != 'Cancelled'")
            revenue = cursor.fetchone()['total_revenue'] or 0

            cursor.execute("SELECT COUNT(*) as active_bookings FROM Reservation WHERE status = 'Confirmed'")
            bookings = cursor.fetchone()['active_bookings']

            cursor.execute("""
                SELECT ro.room_type, COUNT(*) as count 
                FROM Reservation r 
                JOIN Room ro ON r.room_id = ro.room_id 
                GROUP BY ro.room_type 
                ORDER BY count DESC LIMIT 1
            """)
            top_room = cursor.fetchone()
            top_room_type = top_room['room_type'] if top_room else "N/A"

            return jsonify({
                "total_revenue": float(revenue),
                "active_bookings": bookings,
                "top_room_type": top_room_type
            })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()
