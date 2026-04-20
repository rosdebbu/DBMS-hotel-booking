# DBMS Hotel Booking System

A full-stack, comprehensive Database Management System (DBMS) college project for a Hotel. 
Features advanced SQL Normalization, Transaction Control, and Concurrency, complete with a Node.js REST API and a modern Tailwind CSS Frontend Interface.

## Features
- **Frontend**: Beautiful "OTA" style booking page and a Master Admin Dashboard (`admin.html`) built with Tailwind CSS.
- **Backend / API**: Node.js & Express server handling endpoints and database connections.
- **Transactions (TCL)**: Ensures ACIDs properties and prevents invalid database operations during booking.
- **Concurrency Control**: Implements `FOR UPDATE` row-level locking to prevent the 'Lost Update' problem when booking rooms simultaneously. 
- **Normalization Engine**: Provides experimental tables demonstrating the transition from Un-normalized Form (UNF) through 1NF, 2NF, 3NF, and multi-valued Fourth Normal Form (4NF). 

## Setup Instructions

1. **Database Setup**
   - Must have MySQL 9.4 installed.
   - Run the provided SQL scripts (`1_schema.sql`, `2_data.sql`, etc.) in order to set up the `Hotel_Management_System`.
2. **Backend Setup**
   - Ensure Node.js is installed.
   - Run `npm install` to download dependencies.
3. **Run the Application**
   - Start the backend via `node server.js`.
   - The public website runs on `http://localhost:3000`.
   - The Admin Master Control runs on `http://localhost:3000/admin.html`.
