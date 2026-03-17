import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";
import { sendVerificationEmail } from "./services/emailService";

import { OAuth2Client } from "google-auth-library";

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// Google OAuth Login/Register
router.post("/google", async (req: any, res: any) => {
  const { credential } = req.body;

  console.log("Starting Google Auth Protocol for credential:", credential ? "PRESENT" : "MISSING");
  try {
    // Using Authorization header for cleaner request
    const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${credential}`,
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Google userinfo fetch failed. Status:", response.status, "Error:", errorText);
      return res.status(400).json({ error: "Invalid Google token or expired" });
    }

    const payload = await response.json() as any;
    console.log("Successfully retrieved Google payload for:", payload.email);
    const { email, name, sub: googleId } = payload;

    // Check if user exists by googleId or email
    let user = await prisma.user.findFirst({
      where: {
        OR: [{ googleId }, { email }],
      },
    });

    if (!user) {
      // Create new verified user
      user = await prisma.user.create({
        data: {
          email,
          username: name || email.split("@")[0],
          googleId,
          isVerified: true, // Google already verified them
        },
      });
    } else if (!user.googleId) {
      // Link googleId if user existed via email before
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId, isVerified: true },
      });
    }

    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({ token, username: user.username });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({ error: "Google authentication failed" });
  }
});

// Register
router.post("/register", async (req: any, res: any) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        verificationToken,
        isVerified: false,
      },
    });

    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({ 
      message: "Account created! Please check your email for a verification link." 
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    if (error.code === "P2002") {
      return res.status(400).json({ error: "Username or email already exists" });
    }
    res.status(500).json({ error: error.message || "An unexpected error occurred during registration" });
  }
});


// Verify Email
router.get("/verify-email", async (req: any, res: any) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: "Missing token" });
  }

  try {
    const user = await prisma.user.findFirst({
      where: { verificationToken: token as string },
    });

    if (!user) {
      return res.status(404).json({ error: "Invalid or expired token" });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
      },
    });

    res.json({ message: "Email verified successfully! You can now login." });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login
router.post("/login", async (req: any, res: any) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!user.password) {
      return res.status(401).json({ error: "This account uses Google Login. Please use that method." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ error: "Please check your email to verify your account." });
    }

    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Middleware to authenticate JWT
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Access denied: No token provided" });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid token" });
  }
};

// Delete Account
router.delete("/delete-account", authenticateToken, async (req: any, res: any) => {
  try {
    const userId = req.user.userId;

    await prisma.user.delete({
      where: { id: userId },
    });

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Account deletion error:", error);
    res.status(500).json({ error: "Could not delete account" });
  }
});

export default router;
