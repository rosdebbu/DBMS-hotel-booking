INSERT INTO Hotel VALUES
(1, 'Grand Palace', 'Mumbai', '9876543210', 4.5),
(2, 'Ocean View', 'Chennai', '9123456789', 4.2);

INSERT INTO Room VALUES
(101, 'Deluxe', 3500.00, 'Available', 1),
(102, 'Suite', 5500.00, 'Available', 1),
(201, 'Standard', 2500.00, 'Available', 2);

INSERT INTO Guest VALUES
(1, 'Rahul Sharma', '9123456780', 'rahul@gmail.com', 'Delhi', 'Aadhar'),
(2, 'Anita Verma', '9012345678', 'anita@gmail.com', 'Bangalore', 'PAN');

INSERT INTO Reservation VALUES
(1001, 1, 101, '2025-02-10', '2025-02-12', 'Confirmed', 7000.00),
(1002, 2, 102, '2025-03-01', '2025-03-03', 'Confirmed', 11000.00);

INSERT INTO Staff VALUES
(301, 'Ramesh Kumar', 'Manager', 45000.00, 'Morning', 1),
(302, 'Sunita Rao', 'Receptionist', 25000.00, 'Evening', 2);

INSERT INTO Payment VALUES
(401, 1001, 7000.00, 'Card', 'Paid', '2025-02-10'),
(402, 1002, 5000.00, 'UPI', 'Paid', '2025-03-01');

INSERT INTO Service VALUES
(401, 'Laundry', 500.00),
(402, 'Room Service', 300.00);

INSERT INTO Booking_Services VALUES
(1001, 401),
(1001, 402),
(1002, 402);
