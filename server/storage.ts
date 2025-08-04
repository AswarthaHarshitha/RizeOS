import { 
  users, jobs, posts, jobApplications, userConnections, payments,
  type User, type InsertUser, type Job, type InsertJob, 
  type Post, type InsertPost, type JobApplication, type InsertJobApplication,
  type UserConnection, type Payment, type InsertPayment
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, ilike, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  
  // Job operations
  createJob(job: InsertJob & { postedBy: string }): Promise<Job>;
  getJob(id: string): Promise<Job | undefined>;
  getJobs(filters?: { 
    skills?: string[], 
    location?: string, 
    isRemote?: boolean,
    limit?: number,
    offset?: number 
  }): Promise<Job[]>;
  updateJob(id: string, updates: Partial<Job>): Promise<Job>;
  getUserJobs(userId: string): Promise<Job[]>;
  
  // Post operations
  createPost(post: InsertPost & { authorId: string }): Promise<Post>;
  getPosts(limit?: number, offset?: number): Promise<(Post & { author: User })[]>;
  getPost(id: string): Promise<Post | undefined>;
  updatePostStats(id: string, field: 'likes' | 'comments' | 'shares', increment: number): Promise<void>;
  
  // Job application operations
  createJobApplication(application: InsertJobApplication & { applicantId: string }): Promise<JobApplication>;
  getJobApplications(jobId: string): Promise<(JobApplication & { applicant: User })[]>;
  getUserApplications(userId: string): Promise<(JobApplication & { job: Job })[]>;
  
  // Connection operations
  createConnection(requesterId: string, recipientId: string): Promise<UserConnection>;
  getUserConnections(userId: string): Promise<(UserConnection & { requester: User, recipient: User })[]>;
  
  // Payment operations
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPayment(txHash: string): Promise<Payment | undefined>;
  updatePaymentStatus(id: string, status: string): Promise<Payment>;
  
  // AI and matching
  getJobMatches(userId: string): Promise<(Job & { matchScore: number })[]>;
  searchUsers(query: string): Promise<User[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async createJob(job: InsertJob & { postedBy: string }): Promise<Job> {
    const [createdJob] = await db
      .insert(jobs)
      .values(job)
      .returning();
    return createdJob;
  }

  async getJob(id: string): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job || undefined;
  }

  async getJobs(filters?: { 
    skills?: string[], 
    location?: string, 
    isRemote?: boolean,
    limit?: number,
    offset?: number 
  }): Promise<Job[]> {
    let whereConditions = [eq(jobs.isActive, true)];
    
    if (filters?.skills && filters.skills.length > 0) {
      whereConditions.push(
        or(...filters.skills.map(skill => 
          sql`${jobs.requiredSkills} @> ARRAY[${skill}]`
        ))
      );
    }
    
    if (filters?.location) {
      whereConditions.push(ilike(jobs.location, `%${filters.location}%`));
    }
    
    if (filters?.isRemote !== undefined) {
      whereConditions.push(eq(jobs.isRemote, filters.isRemote));
    }
    
    let query = db.select().from(jobs).where(and(...whereConditions)).orderBy(desc(jobs.createdAt));
    
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    
    if (filters?.offset) {
      query = query.offset(filters.offset);
    }
    
    return await query;
  }

  async updateJob(id: string, updates: Partial<Job>): Promise<Job> {
    const [job] = await db
      .update(jobs)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(jobs.id, id))
      .returning();
    return job;
  }

  async getUserJobs(userId: string): Promise<Job[]> {
    return await db
      .select()
      .from(jobs)
      .where(eq(jobs.postedBy, userId))
      .orderBy(desc(jobs.createdAt));
  }

  async createPost(post: InsertPost & { authorId: string }): Promise<Post> {
    const [createdPost] = await db
      .insert(posts)
      .values(post)
      .returning();
    return createdPost;
  }

  async getPosts(limit = 20, offset = 0): Promise<(Post & { author: User })[]> {
    const result = await db
      .select()
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset);
    
    return result.map(row => ({
      ...row.posts,
      author: row.users!
    }));
  }

  async getPost(id: string): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    return post || undefined;
  }

  async updatePostStats(id: string, field: 'likes' | 'comments' | 'shares', increment: number): Promise<void> {
    await db
      .update(posts)
      .set({ [field]: sql`${posts[field]} + ${increment}` })
      .where(eq(posts.id, id));
  }

  async createJobApplication(application: InsertJobApplication & { applicantId: string }): Promise<JobApplication> {
    const [createdApplication] = await db
      .insert(jobApplications)
      .values(application)
      .returning();
    return createdApplication;
  }

  async getJobApplications(jobId: string): Promise<(JobApplication & { applicant: User })[]> {
    const result = await db
      .select()
      .from(jobApplications)
      .leftJoin(users, eq(jobApplications.applicantId, users.id))
      .where(eq(jobApplications.jobId, jobId))
      .orderBy(desc(jobApplications.createdAt));
    
    return result.map(row => ({
      ...row.job_applications,
      applicant: row.users!
    }));
  }

  async getUserApplications(userId: string): Promise<(JobApplication & { job: Job })[]> {
    const result = await db
      .select()
      .from(jobApplications)
      .leftJoin(jobs, eq(jobApplications.jobId, jobs.id))
      .where(eq(jobApplications.applicantId, userId))
      .orderBy(desc(jobApplications.createdAt));
    
    return result.map(row => ({
      ...row.job_applications,
      job: row.jobs!
    }));
  }

  async createConnection(requesterId: string, recipientId: string): Promise<UserConnection> {
    const [connection] = await db
      .insert(userConnections)
      .values({ requesterId, recipientId })
      .returning();
    return connection;
  }

  async getUserConnections(userId: string): Promise<(UserConnection & { requester: User, recipient: User })[]> {
    const result = await db
      .select()
      .from(userConnections)
      .leftJoin(users, eq(userConnections.requesterId, users.id))
      .where(
        and(
          or(
            eq(userConnections.requesterId, userId),
            eq(userConnections.recipientId, userId)
          ),
          eq(userConnections.status, "accepted")
        )
      );
    
    return result.map(row => ({
      ...row.user_connections,
      requester: row.users!,
      recipient: row.users!
    }));
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [createdPayment] = await db
      .insert(payments)
      .values(payment)
      .returning();
    return createdPayment;
  }

  async getPayment(txHash: string): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.txHash, txHash));
    return payment || undefined;
  }

  async updatePaymentStatus(id: string, status: string): Promise<Payment> {
    const [payment] = await db
      .update(payments)
      .set({ status, updatedAt: new Date() })
      .where(eq(payments.id, id))
      .returning();
    return payment;
  }

  async getJobMatches(userId: string): Promise<(Job & { matchScore: number })[]> {
    const user = await this.getUser(userId);
    if (!user || !user.skills?.length) return [];
    
    const jobList = await this.getJobs({ limit: 50 });
    
    // Calculate match scores based on skill overlap
    const matchedJobs = jobList.map(job => {
      const userSkills = user.skills || [];
      const jobSkills = job.requiredSkills || [];
      const commonSkills = userSkills.filter(skill => 
        jobSkills.some(jobSkill => 
          jobSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(jobSkill.toLowerCase())
        )
      );
      const matchScore = jobSkills.length > 0 
        ? Math.round((commonSkills.length / jobSkills.length) * 100)
        : 0;
      
      return { ...job, matchScore };
    });
    
    return matchedJobs
      .filter(job => job.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10);
  }

  async searchUsers(query: string): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .where(
        or(
          ilike(users.firstName, `%${query}%`),
          ilike(users.lastName, `%${query}%`),
          ilike(users.username, `%${query}%`),
          ilike(users.title, `%${query}%`)
        )
      )
      .limit(20);
  }
}

export const storage = new DatabaseStorage();
