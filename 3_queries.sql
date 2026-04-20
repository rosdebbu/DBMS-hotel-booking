-- Constraints
ALTER TABLE Room ADD CONSTRAINT chk_price CHECK (price_per_night > 0);
ALTER TABLE Staff ADD CONSTRAINT chk_salary CHECK (salary > 10000);

-- Aggregate Functions
SELECT SUM(total_amount) AS total_revenue FROM Reservation;
SELECT AVG(salary) AS average_salary FROM Staff;
SELECT hotel_id, COUNT(room_id) AS total_rooms FROM Room GROUP BY hotel_id;

-- Sets
SELECT guest_id FROM Reservation UNION SELECT guest_id FROM Guest;
SELECT guest_id FROM Guest WHERE guest_id IN (SELECT guest_id FROM Reservation);
SELECT guest_id FROM Guest WHERE guest_id NOT IN (SELECT guest_id FROM Reservation);

-- Subqueries
SELECT room_id, room_type, price_per_night FROM Room 
WHERE price_per_night > (SELECT AVG(price_per_night) FROM Room);

SELECT name FROM Guest WHERE guest_id IN (SELECT guest_id FROM Reservation);

SELECT room_id, room_type FROM Room 
WHERE price_per_night = (SELECT MAX(price_per_night) FROM Room);

-- Joins
SELECT G.name, R.room_id, R.room_type 
FROM Guest G
JOIN Reservation RS ON G.guest_id = RS.guest_id
JOIN Room R ON RS.room_id = R.room_id;

SELECT RS.booking_id, P.amount 
FROM Reservation RS
JOIN Payment P ON RS.booking_id = P.booking_id;

-- Views
CREATE VIEW Guest_Booking_View AS
SELECT G.name, R.room_type, RS.check_in, RS.check_out
FROM Guest G
JOIN Reservation RS ON G.guest_id = RS.guest_id
JOIN Room R ON RS.room_id = R.room_id;

SELECT * FROM Guest_Booking_View;
