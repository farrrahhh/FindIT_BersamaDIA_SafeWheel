// File: server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

// Load .env
dotenv.config();

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Root endpoint
app.get("/", (req, res) => {
  res.send("This is SafeWheel API");
});
// ====== SIGNUP USER WHEELCHAIR ======
app.post("/api/signup", async (req, res) => {
  const {
    safewheel_id, // user memberikan ini
    user_email,
    user_password,
    user_name,
    sex,
    dob,
    bloodtype,
    emergency_number,
    location_coordinates
  } = req.body;

  if (!safewheel_id || !user_email || !user_password || !user_name) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Cek apakah ID atau email sudah digunakan
    const existingId = await prisma.userWheelchair.findUnique({
      where: { safewheel_id },
    });

    const existingEmail = await prisma.userWheelchair.findUnique({
      where: { user_email },
    });

    if (existingId) {
      return res.status(409).json({ message: "safewheel_id already exists" });
    }

    if (existingEmail) {
      return res.status(409).json({ message: "Email already in use" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(user_password, 10);

    // Simpan user baru
    const user = await prisma.userWheelchair.create({
      data: {
        safewheel_id,
        user_email,
        user_password: hashedPassword,
        user_name,
        sex,
        dob: dob ? new Date(dob) : null,
        bloodtype,
        emergency_number,
        location_coordinates,
      },
    });

    const { user_password: _, ...safeUser } = user;

    res.status(201).json({
      message: "User registered successfully",
      user: safeUser,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ====== SIGNUP USER GUARDIAN ======
app.post("/api/signup/guardian", async (req, res) => {
  const { guardian_email, guardian_password, guardian_name, safewheel_id } = req.body;

  if (!guardian_email || !guardian_password || !guardian_name || !safewheel_id) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Cek apakah email sudah digunakan
    const existingEmail = await prisma.userGuardian.findUnique({
      where: { guardian_email },
    });

    if (existingEmail) {
      return res.status(409).json({ message: "Email already in use" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(guardian_password, 10);

    // Simpan user baru
    const guardian = await prisma.userGuardian.create({
      data: {
        guardian_email,
        guardian_password: hashedPassword,
        guardian_name,
        safewheel_id,
      },
    });

    const { guardian_password: _, ...safeGuardian } = guardian;

    res.status(201).json({
      message: "Guardian registered successfully",
      user: safeGuardian,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ====== LOGIN ======
app.post("/api/login", async (req, res) => {
  const { user_email, user_password } = req.body;

  if (!user_email || !user_password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Cek apakah email ada
    const user = await prisma.userWheelchair.findUnique({
      where: { user_email },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Cek password
    const isPasswordValid = await bcrypt.compare(user_password, user.user_password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const { user_password: _, ...safeUser } = user;

    res.status(200).json({
      message: "Login successful",
      user: safeUser,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// ====== LOGIN GUARDIAN ======
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required." });

  try {
    // Coba cari di user_wheelchair
    const wheelchairUser = await prisma.userWheelchair.findUnique({
      where: { user_email: email },
    });

    if (wheelchairUser) {
      const valid = await bcrypt.compare(password, wheelchairUser.user_password);
      if (!valid) return res.status(401).json({ message: "Invalid password" });

      const { user_password, ...safeUser } = wheelchairUser;
      return res.status(200).json({
        message: "Login successful",
        role: "wheelchair",
        user: safeUser,
      });
    }

    // Coba cari di user_guardian
    const guardianUser = await prisma.userGuardian.findUnique({
      where: { guardian_email: email },
    });

    if (guardianUser) {
      const valid = await bcrypt.compare(password, guardianUser.guardian_password);
      if (!valid) return res.status(401).json({ message: "Invalid password" });

      const { guardian_password, ...safeUser } = guardianUser;
      return res.status(200).json({
        message: "Login successful",
        role: "guardian",
        user: safeUser,
      });
    }

    // Tidak ditemukan di dua-duanya
    return res.status(404).json({ message: "User not found" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});