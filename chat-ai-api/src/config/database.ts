import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { config } from 'dotenv';

// Load environment variables
config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

// Initialize Neon DB
const sql = neon(process.env.DATABASE_URL!);

// Initialize Drizzle ORM
export const db = drizzle(sql);
