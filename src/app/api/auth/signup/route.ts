import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { createToken } from '@/lib/auth';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    // Check if user already exists
    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT user_id FROM User WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }

    // Hash password using bcrypt
    const password_hash = await bcrypt.hash(password, 10);

    // Insert new user
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO User (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, email, password_hash, 'guest']
    );

    const user = {
      user_id: result.insertId,
      name,
      email,
      role: 'guest' as const,
    };

    // Create JWT token
    const token = await createToken(user);

    // Set httpOnly cookie
    const response = NextResponse.json({ message: 'Account created successfully!', user });
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
