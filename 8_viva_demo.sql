-- =======================================================
-- VIVA DEMONSTRATION FILE: TRANSACTIONS & CONCURRENCY
-- =======================================================
-- Open this file to show your professor your code, or 
-- copy and paste these commands into the MySQL terminal!

-- -------------------------------------------------------
-- DEMO 1: TRANSACTION (ACID PROPERTIES)
-- Demonstrating START TRANSACTION, SAVEPOINT, and ROLLBACK
-- -------------------------------------------------------
START TRANSACTION;

-- Step 1: Insert a new guest
INSERT INTO Guest (guest_id, name, phone, email, address, id_proof) 
VALUES (999, 'Viva Tester', '9999999999', 'viva@test.com', 'College Campus', 'Aadhar-123');

SAVEPOINT Before_Booking;

-- Step 2: Make a reservation for Room 102
INSERT INTO Reservation (booking_id, guest_id, room_id, check_in, check_out, status, total_amount) 
VALUES (9999, 999, 102, '2025-05-01', '2025-05-03', 'Confirmed', 11000.00);

-- Note: In our database, the `room_book_trigger` automatically updates Room 102 to 'Booked'!
-- Let's check the room status!
SELECT room_id, availability_status FROM Room WHERE room_id = 102;

-- Step 3: Oh no! The payment failed or there was a system crash! We must ROLLBACK.
ROLLBACK TO Before_Booking;

-- Let's check the room status again. It safely reverted back to 'Available'!
SELECT room_id, availability_status FROM Room WHERE room_id = 102;

-- We completely abort the transaction to keep the database clean
COMMIT;


-- -------------------------------------------------------
-- DEMO 2: CONCURRENCY CONTROL (ROW-LEVEL LOCKING)
-- Preventing the 'Lost Update' problem when 2 people try to 
-- book exactly the same room at the exact same millisecond.
-- -------------------------------------------------------

START TRANSACTION;

-- By adding "FOR UPDATE", we place an exclusive lock on Room 103!
-- If another user opens a second terminal and tries to update Room 103, 
-- their terminal will freeze and WAIT until we type COMMIT.
SELECT * FROM Room WHERE room_id = 103 FOR UPDATE;

-- Update the room status
UPDATE Room SET availability_status = 'Booked' WHERE room_id = 103;

-- The lock is finally released ONLY when we commit!
COMMIT;
