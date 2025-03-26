import { pgTable, text, serial, integer, boolean, timestamp, numeric, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  email: true,
});

// Expense categories schema
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  userId: integer("user_id").notNull(),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  icon: true,
  color: true,
  userId: true,
});

// Transactions schema
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  description: text("description").notNull(),
  amount: numeric("amount").notNull(),
  date: timestamp("date").notNull(),
  type: text("type").notNull(), // 'income' or 'expense'
  categoryId: integer("category_id"),
  userId: integer("user_id").notNull(),
  accountId: integer("account_id"),
  notes: text("notes"),
});

export const insertTransactionSchema = createInsertSchema(transactions)
  .pick({
    description: true,
    amount: true,
    date: true,
    type: true,
    categoryId: true,
    userId: true,
    accountId: true,
    notes: true,
  })
  .extend({
    // Override the date field to accept string input
    date: z.string().or(z.date())
  });

// Financial goals schema
export const goals = pgTable("goals", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  targetAmount: numeric("target_amount").notNull(),
  currentAmount: numeric("current_amount").notNull(),
  targetDate: timestamp("target_date").notNull(),
  userId: integer("user_id").notNull(),
  status: text("status").notNull(), // 'on_track', 'falling_behind', 'just_started', 'completed'
});

export const insertGoalSchema = createInsertSchema(goals)
  .pick({
    title: true,
    description: true,
    targetAmount: true,
    currentAmount: true,
    targetDate: true,
    userId: true,
    status: true,
  })
  .extend({
    // Override the targetDate field to accept string input
    targetDate: z.string().or(z.date())
  });

// Upcoming events schema
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  amount: numeric("amount").notNull(),
  date: timestamp("date").notNull(),
  userId: integer("user_id").notNull(),
  priority: text("priority").notNull(), // 'high', 'medium', 'low'
  category: text("category").notNull(), // 'Housing', 'Insurance', 'Utilities', etc.
});

export const insertEventSchema = createInsertSchema(events)
  .pick({
    title: true,
    description: true,
    amount: true,
    date: true,
    userId: true,
    priority: true,
    category: true,
  })
  .extend({
    // Override the date field to accept string input
    date: z.string().or(z.date())
  });

// Bank accounts schema
export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  accountNumber: text("account_number").notNull(),
  bankName: text("bank_name").notNull(),
  accountType: text("account_type").notNull(), // 'checking', 'savings', 'credit_card', etc.
  balance: numeric("balance").notNull(),
  userId: integer("user_id").notNull(),
  notes: text("notes"),
  credentials: json("credentials"), // Securely stored credentials
});

export const insertAccountSchema = createInsertSchema(accounts).pick({
  name: true,
  accountNumber: true,
  bankName: true,
  accountType: true,
  balance: true,
  userId: true,
  notes: true,
  credentials: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type Goal = typeof goals.$inferSelect;
export type InsertGoal = z.infer<typeof insertGoalSchema>;

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

export type Account = typeof accounts.$inferSelect;
export type InsertAccount = z.infer<typeof insertAccountSchema>;
