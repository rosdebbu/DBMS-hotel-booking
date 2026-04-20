-- Transaction 1: Reservation Handling & Savepoints
START TRANSACTION;

UPDATE Room SET availability_status = 'Booked' WHERE room_id = 101;
SAVEPOINT A;

INSERT INTO Reservation VALUES (1003, 1, 101, '2025-04-01', '2025-04-03', 'Confirmed', 7000.00);
SAVEPOINT B;

INSERT INTO Reservation VALUES (1004, 2, 101, '2025-04-02', '2025-04-05', 'Confirmed', 9000.00);
SAVEPOINT C;

-- To prove it works to the portal, you execute the rollbacks:
ROLLBACK TO B;
ROLLBACK TO A;
COMMIT;

-- Transaction 2: Payment Processing
START TRANSACTION;

INSERT INTO Payment VALUES (403, 1001, 7000.00, 'Card', 'Pending', CURDATE());
SAVEPOINT A;

UPDATE Payment SET payment_status = 'Paid' WHERE payment_id = 403;
SAVEPOINT B;

-- Simulating a bad update
UPDATE Payment SET amount = -500.00 WHERE payment_id = 403;

-- Reverting the bad update
ROLLBACK TO B;
COMMIT;

-- Transaction 3: Guest Data Update
START TRANSACTION;

UPDATE Guest SET phone = '9999999999' WHERE guest_id = 1;
SAVEPOINT A;

-- Simulating an invalid email update
UPDATE Guest SET email = 'wrong_email';

-- Revert the bad email update but keep the phone update
ROLLBACK TO A;
COMMIT;

-- Transaction 4: Staff Salary Update
START TRANSACTION;

UPDATE Staff SET salary = salary + 5000 WHERE staff_id = 301;
SAVEPOINT A;

-- Simulating a negative salary error
UPDATE Staff SET salary = -10000 WHERE staff_id = 301;

-- Revert the negative salary
ROLLBACK TO A;
COMMIT;

-- Transaction 5: Booking Services (Handling Duplicates)
START TRANSACTION;

-- Assuming (1001, 401) already exists from DML inserts, this will throw an error.
-- INSERT INTO Booking_Services VALUES (1001, 401); 

SAVEPOINT A;
-- INSERT INTO Booking_Services VALUES (1001, 402); -- Also a duplicate

SAVEPOINT B;
-- Inserting a fresh service
INSERT INTO Booking_Services VALUES (1001, 403);

ROLLBACK TO B;
ROLLBACK TO A;
COMMIT;
