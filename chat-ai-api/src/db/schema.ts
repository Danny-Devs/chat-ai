import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Define the 'chats' table - this will store all chat messages and AI responses
export const chats = pgTable('chats', {
  // 'id' column: Auto-incrementing number that uniquely identifies each chat message
  // 'serial' is like AUTO_INCREMENT in MySQL - it automatically assigns the next number
  id: serial('id').primaryKey(), // This makes it the primary key (unique identifier for the row)

  // 'userId' column: Stores which user this chat belongs to
  // Uses the user's UUID (from the users table) as a reference
  userId: text('user_id').notNull(), // .notNull() means this field cannot be empty

  // 'message' column: The actual message sent by the user
  message: text('message').notNull(),

  // 'reply' column: The AI response to the user's message
  reply: text('reply').notNull(),

  createdAt: timestamp('created_at').notNull().defaultNow()
});

// Define the 'users' table - this stores information about registered users
export const users = pgTable('users', {
  // 'id' column: The unique identifier for each user (a UUID string)
  // We use text type because UUIDs are stored as strings
  userId: text('user_id').primaryKey(),

  // 'name' column: The user's name
  name: text('name').notNull(),

  // 'email' column: The user's email address
  // .unique() ensures no two users can have the same email
  email: text('email').notNull().unique(),

  // 'createdAt' column: When the user account was created
  createdAt: timestamp('created_at').notNull().defaultNow()
});

// TypeScript type definitions - these help with type safety when working with the database
// -----------------------------------------------------------------------
// These types allow TypeScript to know exactly what fields and types are expected
// when you insert or select data from these tables

// Type for inserting a new chat - TypeScript will enforce that you provide all required fields
export type ChatInsert = typeof chats.$inferInsert;
// Type for data retrieved from the chats table - lets you access properties with autocompletion
export type ChatSelect = typeof chats.$inferSelect;

// Same types for the users table
export type UserInsert = typeof users.$inferInsert;
export type UserSelect = typeof users.$inferSelect;
