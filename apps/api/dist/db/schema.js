import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
export const contacts = sqliteTable('contacts', {
  id: text('id').primaryKey(), // we'll store uuid
  createdAt: text('created_at').notNull(), // ISO string
  name: text('name').notNull(),
  email: text('email').notNull(),
  message: text('message').notNull(),
});
