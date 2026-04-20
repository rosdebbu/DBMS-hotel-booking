-- Part 7: Concurrency Control (Row-Level Locking)
START TRANSACTION;

-- This locks row 101 so no other transaction can read or write to it until you COMMIT.
SELECT * FROM Room 
WHERE room_id = 101 
FOR UPDATE;

UPDATE Room SET availability_status = 'Booked' WHERE room_id = 101;

COMMIT;
