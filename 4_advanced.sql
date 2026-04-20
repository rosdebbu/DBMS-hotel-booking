-- Trigger 1: Room Availability
DELIMITER //
CREATE TRIGGER room_book_trigger
AFTER INSERT ON Reservation
FOR EACH ROW
BEGIN
    UPDATE Room SET availability_status = 'Booked' WHERE room_id = NEW.room_id;
END//
DELIMITER ;

-- Trigger 2: Payment Check
DELIMITER //
CREATE TRIGGER payment_check
BEFORE INSERT ON Payment
FOR EACH ROW
BEGIN
    IF NEW.amount < 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid Payment Amount';
    END IF;
END//
DELIMITER ;

-- Procedure with Cursor
DELIMITER //
CREATE PROCEDURE display_guest_names()
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE g_name VARCHAR(100);
    DECLARE guest_cursor CURSOR FOR SELECT name FROM Guest;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
    
    OPEN guest_cursor;
    read_loop: LOOP
        FETCH guest_cursor INTO g_name;
        IF done = 1 THEN
            LEAVE read_loop;
        END IF;
        SELECT g_name;
    END LOOP;
    CLOSE guest_cursor;
END//
DELIMITER ;
CALL display_guest_names();

-- Procedure with Exception Handling
DELIMITER //
CREATE PROCEDURE check_booking_payment()
BEGIN
    DECLARE v_amount DECIMAL(10,2);
    DECLARE not_found INT DEFAULT 0;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET not_found = 1;
    
    SELECT amount INTO v_amount FROM Payment WHERE booking_id = 999;
    
    IF not_found = 1 THEN
        SELECT 'Booking not found' AS message;
    ELSE
        SELECT CONCAT('Payment Amount: ', v_amount) AS message;
    END IF;
END//
DELIMITER ;
CALL check_booking_payment();
