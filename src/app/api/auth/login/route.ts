import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { createToken } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    // Find user by email
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT user_id, name, email, password_hash, role FROM User WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'No account found with this email.' }, { status: 401 });
    }

    const dbUser = rows[0];

    // Compare password with bcrypt hash
    const valid = await bcrypt.compare(password, dbUser.password_hash);
    if (!valid) {
      return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });
    }

    const user = {
      user_id: dbUser.user_id,
      name: dbUser.name,
      email: dbUser.email,
      role: dbUser.role as 'guest' | 'admin',
    };

    // Create JWT token
    const token = await createToken(user);

    // Set httpOnly cookie
    const response = NextResponse.json({ message: 'Login successful!', user });
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
