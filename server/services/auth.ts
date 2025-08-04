import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

interface AuthRequest extends Request {
  userId?: string;
}

export class AuthService {
  generateToken(userId: string): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
  }

  verifyToken(token: string): { userId: string } | null {
    try {
      const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
      return payload;
    } catch (error) {
      return null;
    }
  }

  authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
      }

      const token = authHeader.split(" ")[1];
      const payload = this.verifyToken(token);
      
      if (!payload) {
        return res.status(401).json({ message: "Invalid token" });
      }

      req.userId = payload.userId;
      next();
    } catch (error) {
      console.error("Authentication error:", error);
      res.status(401).json({ message: "Authentication failed" });
    }
  };
}

export const authService = new AuthService();

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}
