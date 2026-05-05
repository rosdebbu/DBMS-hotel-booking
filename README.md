# GoAnywhere — Advanced Hotel Booking Platform

![GoAnywhere Hero](https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=400&fit=crop&q=80)

> **GoAnywhere** is a high-performance, full-stack hotel booking and management platform engineered with Next.js 14, Tailwind CSS v4, and raw MySQL. Designed initially as an advanced Database Management System (DBMS) project, it showcases seamless integration of complex relational database concepts (triggers, stored procedures, ACID transactions) with a modern, high-fidelity user interface.

![End-to-End Walkthrough](./artifacts/booking_flow_demo.webp)

## 🚀 Key Features

### 1. Robust Full-Stack Architecture
- **Next.js 14 App Router:** Server-side rendering (SSR) and seamless API route integration for optimal performance.
- **Vercel-Ready:** Zero-config deployment pipeline tailored for cloud-native hosting.
- **Custom Authentication:** Secure, stateless JWT-based authentication with bcrypt password hashing—no third-party auth providers.

### 2. High-Fidelity UI/UX
- **Premium Dark Aesthetic:** Meticulously crafted using Tailwind CSS v4 with glassmorphism effects, dynamic meshes, and subtle micro-animations.
- **Multi-Step Checkout:** An intuitive, friction-free booking flow simulating real-world e-commerce experiences.
- **Admin Dashboard:** A centralized control panel providing real-time statistics, reservation management, and guest directory overview.

### 3. Advanced Database Implementation (MySQL)
- **Raw SQL Execution:** Bypasses standard ORMs (like Prisma) to execute raw `mysql2/promise` queries, demonstrating complete control over database logic.
- **ACID Transactions:** Ensures absolute data integrity during multi-table booking insertions.
- **Automated Triggers:** Database-level triggers automatically manage room availability states the exact moment a booking is confirmed or canceled.

---

## 🛠 Technology Stack

- **Frontend:** React 18, Next.js 14, Tailwind CSS v4, Lucide React
- **Backend:** Next.js API Routes (Serverless)
- **Database:** MySQL (Local & TiDB Cloud Serverless compatible)
- **Security:** `jose` (JWT), `bcryptjs`

---

## 💻 Getting Started

### Prerequisites
- Node.js 18+
- MySQL 8.0+

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/DBMS-hotel-booking.git
   cd DBMS-hotel-booking
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   MYSQL_HOST=localhost
   MYSQL_USER=root
   MYSQL_PASSWORD=your_password
   MYSQL_DB=Hotel_Management_System
   JWT_SECRET=your_secure_random_string
   ```

4. **Initialize the Database:**
   The application will automatically attempt to create the `User` table on the first startup. For the full hotel and booking schema, execute the provided SQL files (`1_schema.sql`, `2_data.sql`, etc.) in your MySQL environment.

5. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📚 Database Architecture & Schema

This project adheres strictly to standard relational database design principles. Key relationships include:
- `Hotel` (1:N) `Room`
- `Guest` (1:N) `Reservation`
- `Reservation` (1:1) `Payment`

*(Refer to the `.sql` files in the root directory for exact table structures and complex query implementations used during the academic viva.)*

---

*Developed with 💡 for academic excellence and modern web standards.*
