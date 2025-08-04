import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, decimal, boolean, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  bio: text("bio"),
  title: text("title"),
  linkedinUrl: text("linkedin_url"),
  walletAddress: text("wallet_address"),
  walletType: text("wallet_type"), // 'metamask' | 'phantom'
  skills: text("skills").array().default([]),
  profileImageUrl: text("profile_image_url"),
  profileStrength: integer("profile_strength").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const jobs = pgTable("jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  company: text("company").notNull(),
  description: text("description").notNull(),
  location: text("location"),
  salaryRange: text("salary_range"),
  requiredSkills: text("required_skills").array().default([]),
  employmentType: text("employment_type"), // 'full-time' | 'part-time' | 'contract' | 'freelance'
  isRemote: boolean("is_remote").default(false),
  postedBy: varchar("posted_by").notNull().references(() => users.id),
  paymentStatus: text("payment_status").default("pending"), // 'pending' | 'paid' | 'failed'
  paymentTxHash: text("payment_tx_hash"),
  paymentAmount: decimal("payment_amount", { precision: 18, scale: 8 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const posts = pgTable("posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  content: text("content").notNull(),
  authorId: varchar("author_id").notNull().references(() => users.id),
  type: text("type").default("text"), // 'text' | 'job' | 'image'
  mediaUrls: text("media_urls").array().default([]),
  tags: text("tags").array().default([]),
  jobId: varchar("job_id").references(() => jobs.id),
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  shares: integer("shares").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const jobApplications = pgTable("job_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  jobId: varchar("job_id").notNull().references(() => jobs.id),
  applicantId: varchar("applicant_id").notNull().references(() => users.id),
  status: text("status").default("pending"), // 'pending' | 'reviewed' | 'accepted' | 'rejected'
  matchScore: integer("match_score"),
  coverLetter: text("cover_letter"),
  resumeUrl: text("resume_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userConnections = pgTable("user_connections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  requesterId: varchar("requester_id").notNull().references(() => users.id),
  recipientId: varchar("recipient_id").notNull().references(() => users.id),
  status: text("status").default("pending"), // 'pending' | 'accepted' | 'rejected'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  jobId: varchar("job_id").references(() => jobs.id),
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  currency: text("currency").notNull(), // 'ETH' | 'MATIC' | 'SOL'
  txHash: text("tx_hash").notNull(),
  blockchainNetwork: text("blockchain_network").notNull(), // 'ethereum' | 'polygon' | 'solana'
  status: text("status").default("pending"), // 'pending' | 'confirmed' | 'failed'
  purpose: text("purpose").notNull(), // 'job_posting' | 'premium_feature'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  jobs: many(jobs),
  posts: many(posts),
  applications: many(jobApplications),
  sentConnections: many(userConnections, { relationName: "requesterConnections" }),
  receivedConnections: many(userConnections, { relationName: "recipientConnections" }),
  payments: many(payments),
}));

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  poster: one(users, { fields: [jobs.postedBy], references: [users.id] }),
  applications: many(jobApplications),
  posts: many(posts),
  payments: many(payments),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, { fields: [posts.authorId], references: [users.id] }),
  job: one(jobs, { fields: [posts.jobId], references: [jobs.id] }),
}));

export const jobApplicationsRelations = relations(jobApplications, ({ one }) => ({
  job: one(jobs, { fields: [jobApplications.jobId], references: [jobs.id] }),
  applicant: one(users, { fields: [jobApplications.applicantId], references: [users.id] }),
}));

export const userConnectionsRelations = relations(userConnections, ({ one }) => ({
  requester: one(users, { fields: [userConnections.requesterId], references: [users.id], relationName: "requesterConnections" }),
  recipient: one(users, { fields: [userConnections.recipientId], references: [users.id], relationName: "recipientConnections" }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, { fields: [payments.userId], references: [users.id] }),
  job: one(jobs, { fields: [payments.jobId], references: [jobs.id] }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  postedBy: true,
  paymentStatus: true,
  paymentTxHash: true,
  paymentAmount: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  authorId: true,
  likes: true,
  comments: true,
  shares: true,
  createdAt: true,
  updatedAt: true,
});

export const insertJobApplicationSchema = createInsertSchema(jobApplications).omit({
  id: true,
  applicantId: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type JobApplication = typeof jobApplications.$inferSelect;
export type InsertJobApplication = z.infer<typeof insertJobApplicationSchema>;
export type UserConnection = typeof userConnections.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
