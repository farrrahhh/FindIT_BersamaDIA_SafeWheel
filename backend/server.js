// File: server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from 'bcryptjs';

// Import models dari CommonJS
import { sequelize, UserWheelchair, UserGuardian } from './models.js';
// Load .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Root endpoint
app.get("/", (req, res) => {
  res.send("This is SafeWheel API");
});

// ====== SIGNUP ======
app.post("/api/signup", async (req, res) => {
  const { user_email, user_password, user_name, guardian_email } = req.body;

  if (!user_email || !user_password || !user_name) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const existingUser = await UserWheelchair.findByPk(user_email);
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(user_password, 10);

    const user = await UserWheelchair.create({
      user_email,
      user_password: hashedPassword,
      user_name,
      guardian_email
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ====== LOGIN ======
app.post("/api/login", async (req, res) => {
  const { user_email, user_password } = req.body;

  if (!user_email || !user_password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  try {
    const user = await UserWheelchair.findByPk(user_email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const match = await bcrypt.compare(user_password, user.user_password);
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({ message: "Login successful", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
// ====== GET ALL USERS ======
app.get("/api/users", async (req, res) => {
  try {
    const users = await UserWheelchair.findAll({
      attributes: { exclude: ["user_password"] },
      include: {
        model: UserGuardian,
        attributes: ["guardian_email", "guardian_name"]
      }
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Start server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database Connected...");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

startServer();