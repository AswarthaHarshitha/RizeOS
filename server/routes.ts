import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertJobSchema, insertPostSchema, insertJobApplicationSchema, insertPaymentSchema } from "@shared/schema";
import { authService } from "./services/auth";
import { AIService } from "./services/aiService";
import bcrypt from "bcrypt";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }

      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Create user
      const user = await storage.createUser({
        username: userData.username,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        password: hashedPassword,
        confirmPassword: hashedPassword,
        bio: userData.bio,
        title: userData.title,
        linkedinUrl: userData.linkedinUrl,
        skills: userData.skills,
        profileStrength: 0,
      });

      // Generate JWT token
      const token = authService.generateToken(user.id);
      
      // Remove password from response
      const { password, ...userResponse } = user;
      
      res.json({ user: userResponse, token });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({ message: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = authService.generateToken(user.id);
      const { password: _, ...userResponse } = user;
      
      res.json({ user: userResponse, token });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.get("/api/auth/me", authService.authenticate, async (req, res) => {
    try {
      const user = await storage.getUser(req.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // User routes
  app.put("/api/users/profile", authService.authenticate, async (req, res) => {
    try {
      const updates = req.body;
      const user = await storage.updateUser(req.userId!, updates);
      const { password, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  app.post("/api/users/extract-skills", authService.authenticate, async (req, res) => {
    try {
      const { text } = req.body;
      const skills = await AIService.extractSkills(text);
      res.json({ skills });
    } catch (error) {
      console.error("Skill extraction error:", error);
      res.status(500).json({ message: "Failed to extract skills" });
    }
  });

  app.get("/api/users/search", authService.authenticate, async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const users = await storage.searchUsers(query);
      const usersResponse = users.map(({ password, ...user }) => user);
      res.json(usersResponse);
    } catch (error) {
      console.error("User search error:", error);
      res.status(500).json({ message: "Failed to search users" });
    }
  });

  // Job routes
  app.post("/api/jobs", authService.authenticate, async (req, res) => {
    try {
      const jobData = insertJobSchema.parse(req.body);
      const job = await storage.createJob({
        ...jobData,
        postedBy: req.userId!,
      });
      res.json(job);
    } catch (error) {
      console.error("Create job error:", error);
      res.status(400).json({ message: "Failed to create job" });
    }
  });

  app.get("/api/jobs", async (req, res) => {
    try {
      const { skills, location, isRemote, limit, offset } = req.query;
      const filters = {
        skills: skills ? (skills as string).split(',') : undefined,
        location: location as string,
        isRemote: isRemote === 'true',
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      };
      
      const jobs = await storage.getJobs(filters);
      res.json(jobs);
    } catch (error) {
      console.error("Get jobs error:", error);
      res.status(500).json({ message: "Failed to get jobs" });
    }
  });

  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const job = await storage.getJob(req.params.id);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      res.json(job);
    } catch (error) {
      console.error("Get job error:", error);
      res.status(500).json({ message: "Failed to get job" });
    }
  });

  app.get("/api/jobs/matches/:userId", authService.authenticate, async (req, res) => {
    try {
      const matches = await storage.getJobMatches(req.userId!);
      res.json(matches);
    } catch (error) {
      console.error("Get job matches error:", error);
      res.status(500).json({ message: "Failed to get job matches" });
    }
  });

  // Post routes
  app.post("/api/posts", authService.authenticate, async (req, res) => {
    try {
      const postData = insertPostSchema.parse(req.body);
      const post = await storage.createPost({
        ...postData,
        authorId: req.userId!,
      });
      res.json(post);
    } catch (error) {
      console.error("Create post error:", error);
      res.status(400).json({ message: "Failed to create post" });
    }
  });

  app.get("/api/posts", async (req, res) => {
    try {
      const { limit, offset } = req.query;
      const posts = await storage.getPosts(
        limit ? parseInt(limit as string) : undefined,
        offset ? parseInt(offset as string) : undefined
      );
      res.json(posts);
    } catch (error) {
      console.error("Get posts error:", error);
      res.status(500).json({ message: "Failed to get posts" });
    }
  });

  app.post("/api/posts/:id/like", authService.authenticate, async (req, res) => {
    try {
      await storage.updatePostStats(req.params.id, 'likes', 1);
      res.json({ success: true });
    } catch (error) {
      console.error("Like post error:", error);
      res.status(500).json({ message: "Failed to like post" });
    }
  });

  // Job application routes
  app.post("/api/applications", authService.authenticate, async (req, res) => {
    try {
      const applicationData = insertJobApplicationSchema.parse(req.body);
      
      // Calculate match score using AI
      const user = await storage.getUser(req.userId!);
      const job = await storage.getJob(applicationData.jobId);
      
      let matchScore = 0;
      if (user && job) {
        const profile = `${user.bio || ''} ${user.title || ''}`;
        const jobDescription = `${job.title} ${job.description}`;
        const matchResult = await AIService.calculateJobMatch(
          profile,
          jobDescription,
          user.skills || []
        );
        matchScore = matchResult.matchScore;
      }
      
      const application = await storage.createJobApplication({
        ...applicationData,
        applicantId: req.userId!,
  
      });
      
      res.json(application);
    } catch (error) {
      console.error("Create application error:", error);
      res.status(400).json({ message: "Failed to create application" });
    }
  });

  app.get("/api/applications/user", authService.authenticate, async (req, res) => {
    try {
      const applications = await storage.getUserApplications(req.userId!);
      res.json(applications);
    } catch (error) {
      console.error("Get user applications error:", error);
      res.status(500).json({ message: "Failed to get applications" });
    }
  });

  // Payment routes
  app.post("/api/payments/verify", authService.authenticate, async (req, res) => {
    try {
      const { txHash, amount, currency, blockchainNetwork, purpose, jobId } = req.body;
      
      // For demo purposes, we'll accept the transaction as valid
      // In production, this would verify on the actual blockchain
      const verification = { isValid: true };
      
      // Create payment record
      const payment = await storage.createPayment({
        userId: req.userId!,
        jobId,
        amount,
        currency,
        txHash,
        blockchainNetwork,
        purpose,
        status: "verified",
      });
      
      // If this is for a job posting, update the job payment status
      if (purpose === "job_posting" && jobId) {
        await storage.updateJob(jobId, {
          paymentStatus: "paid",
          paymentTxHash: txHash,
          paymentAmount: amount,
        });
      }
      
      res.json(payment);
    } catch (error) {
      console.error("Payment verification error:", error);
      res.status(500).json({ message: "Failed to verify payment" });
    }
  });

  app.get("/api/payments/status/:txHash", authService.authenticate, async (req, res) => {
    try {
      const payment = await storage.getPayment(req.params.txHash);
      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }
      res.json(payment);
    } catch (error) {
      console.error("Get payment status error:", error);
      res.status(500).json({ message: "Failed to get payment status" });
    }
  });

  // AI-powered endpoints
  app.post("/api/ai/extract-skills", authService.authenticate, async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ message: "Text is required" });
      }
      
      const skills = await AIService.extractSkills(text);
      res.json({ skills });
    } catch (error) {
      console.error("AI skill extraction error:", error);
      res.status(500).json({ message: "Failed to extract skills" });
    }
  });

  app.post("/api/ai/job-match", authService.authenticate, async (req, res) => {
    try {
      const { candidateProfile, jobDescription, candidateSkills } = req.body;
      
      const matchResult = await AIService.calculateJobMatch(
        candidateProfile,
        jobDescription,
        candidateSkills || []
      );
      
      res.json(matchResult);
    } catch (error) {
      console.error("AI job matching error:", error);
      res.status(500).json({ message: "Failed to calculate job match" });
    }
  });

  app.post("/api/ai/career-insights", authService.authenticate, async (req, res) => {
    try {
      const { profile, skills, experience } = req.body;
      
      const insights = await AIService.generateCareerInsights(
        profile,
        skills || [],
        experience || []
      );
      
      res.json(insights);
    } catch (error) {
      console.error("AI career insights error:", error);
      res.status(500).json({ message: "Failed to generate career insights" });
    }
  });

  app.post("/api/ai/optimize-job", authService.authenticate, async (req, res) => {
    try {
      const { jobTitle, jobDescription } = req.body;
      
      const optimization = await AIService.optimizeJobPosting(jobTitle, jobDescription);
      res.json(optimization);
    } catch (error) {
      console.error("AI job optimization error:", error);
      res.status(500).json({ message: "Failed to optimize job posting" });
    }
  });

  app.post("/api/ai/profile-summary", authService.authenticate, async (req, res) => {
    try {
      const { name, experience, skills, bio } = req.body;
      
      const summary = await AIService.generateProfileSummary(name, experience, skills, bio);
      res.json(summary);
    } catch (error) {
      console.error("AI profile summary error:", error);
      res.status(500).json({ message: "Failed to generate profile summary" });
    }
  });

  // Enhanced job matches with real AI
  app.get("/api/jobs/matches/current-user", authService.authenticate, async (req, res) => {
    try {
      const user = await storage.getUser(req.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const jobs = await storage.getJobs();
      const matches = [];

      for (const job of jobs) {
        const profile = `${user.bio || ''} ${user.title || ''}`;
        const jobDescription = `${job.title} ${job.description}`;
        
        const matchResult = await AIService.calculateJobMatch(
          profile,
          jobDescription,
          user.skills || []
        );

        matches.push({
          job,
          matchScore: matchResult.matchScore,
          strengths: matchResult.strengths,
          gaps: matchResult.gaps,
          recommendations: matchResult.recommendations
        });
      }

      // Sort by match score descending
      matches.sort((a, b) => b.matchScore - a.matchScore);

      res.json(matches);
    } catch (error) {
      console.error("Get AI job matches error:", error);
      res.status(500).json({ message: "Failed to get job matches" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
