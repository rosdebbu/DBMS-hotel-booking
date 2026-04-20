-- EXPT 7A: 1NF to 3NF 
-- The Bad Table
CREATE TABLE Bad_Booking_UNF (
    booking_id INT, guest_name VARCHAR(100), guest_phone VARCHAR(15), services_booked VARCHAR(255)
);
INSERT INTO Bad_Booking_UNF VALUES (1001, 'Rahul Sharma', '9123456780', 'Laundry, Spa');

-- 1NF Form
CREATE TABLE Booking_1NF (
    booking_id INT, guest_name VARCHAR(100), guest_phone VARCHAR(15), service_name VARCHAR(100),
    PRIMARY KEY (booking_id, service_name)
);

-- 2NF Form
CREATE TABLE Booking_Info_2NF (
    booking_id INT PRIMARY KEY, guest_name VARCHAR(100), guest_phone VARCHAR(15)
);
CREATE TABLE Booking_Services_2NF (
    booking_id INT, service_name VARCHAR(100), PRIMARY KEY (booking_id, service_name)
);

-- 3NF Form
CREATE TABLE Guest_3NF (
    guest_id INT AUTO_INCREMENT PRIMARY KEY, guest_name VARCHAR(100), guest_phone VARCHAR(15)
);
CREATE TABLE Reservation_3NF (
    booking_id INT PRIMARY KEY, guest_id INT, FOREIGN KEY (guest_id) REFERENCES Guest_3NF(guest_id)
);

-- EXPT 7B: 4NF (Removing Multi-Valued Dependencies)
-- The Bad Table
CREATE TABLE Hotel_Offerings_Bad (
    hotel_id INT, amenity VARCHAR(50), room_type VARCHAR(50),
    PRIMARY KEY (hotel_id, amenity, room_type)
);
INSERT INTO Hotel_Offerings_Bad VALUES (1, 'Pool', 'Single'), (1, 'Pool', 'Double');

-- 4NF Form
CREATE TABLE Hotel_Amenities_4NF (
    hotel_id INT, amenity VARCHAR(50), PRIMARY KEY (hotel_id, amenity)
);
CREATE TABLE Hotel_RoomTypes_4NF (
    hotel_id INT, room_type VARCHAR(50), PRIMARY KEY (hotel_id, room_type)
);
