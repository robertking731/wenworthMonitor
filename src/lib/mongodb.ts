// lib/mongodb.ts

import { MongoClient } from 'mongodb';

const uri = process.env.NEXT_PUBLIC_MONGODB_URI;
const options = {};

const client = new MongoClient(uri as string, options);
const clientPromise: Promise<MongoClient> = client.connect();

export default clientPromise;
