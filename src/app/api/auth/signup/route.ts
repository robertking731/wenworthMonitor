// pages/api/signup.ts
import bcrypt from 'bcrypt';
import { NextResponse } from "next/server";

import clientPromise from 'src/lib/mongodb';

export async function POST(req: Request) {

  try {
    const data = await req.json();
    const { email, name, password } = data;

    const client = await clientPromise;
    const db = client.db('aleksey-portfolio');
    const usersCollection = db.collection('users');

    const userExists = await usersCollection.findOne({ email });
    if (userExists) {
      return NextResponse.json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { email, name, password: hashedPassword };

    await usersCollection.insertOne(user);

    return NextResponse.json({ message: 'User created' });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};