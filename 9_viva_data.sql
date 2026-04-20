-- Populate 1NF
INSERT INTO Booking_1NF VALUES 
(1001, 'Rahul Sharma', '9123456780', 'Laundry'),
(1001, 'Rahul Sharma', '9123456780', 'Spa');

-- Populate 2NF
INSERT INTO Booking_Info_2NF VALUES (1001, 'Rahul Sharma', '9123456780');
INSERT INTO Booking_Services_2NF VALUES (1001, 'Laundry'), (1001, 'Spa');

-- Populate 3NF
INSERT INTO Guest_3NF (guest_name, guest_phone) VALUES ('Rahul Sharma', '9123456780');
-- Assuming Guest ID will be 1
INSERT INTO Reservation_3NF VALUES (1001, 1);

-- Populate 4NF (Separated the Pool into Amenities and Single/Double into RoomTypes)
INSERT INTO Hotel_Amenities_4NF VALUES (1, 'Pool'), (1, 'Gym');
INSERT INTO Hotel_RoomTypes_4NF VALUES (1, 'Single'), (1, 'Double');
