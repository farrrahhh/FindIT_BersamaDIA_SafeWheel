// File: server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { sendPushNotification } from "./utils/sendNotification.js";

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
    location_coordinates,
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
  const { guardian_email, guardian_password, guardian_name, safewheel_id } =
    req.body;

  if (
    !guardian_email ||
    !guardian_password ||
    !guardian_name ||
    !safewheel_id
  ) {
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
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .json({ message: "Email and password are required." });

  try {
    // Coba cari di user_wheelchair
    const wheelchairUser = await prisma.userWheelchair.findUnique({
      where: { user_email: email },
    });

    if (wheelchairUser) {
      const valid = await bcrypt.compare(
        password,
        wheelchairUser.user_password
      );
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
      const valid = await bcrypt.compare(
        password,
        guardianUser.guardian_password
      );
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

// ====== GET USER WHEELCHAIR OR GUARDIAN DATA ======
app.get("/api/user", async (req, res) => {
  const { role, email } = req.query;

  if (!role || !email) {
    return res.status(400).json({ message: "Role and email are required" });
  }

  try {
    if (role === "wheelchair") {
      const user = await prisma.userWheelchair.findUnique({
        where: { user_email: String(email) },
      });
      if (!user) return res.status(404).json({ message: "User not found" });

      const { user_password, ...safeUser } = user;
      return res.status(200).json({ user: safeUser });
    }

    if (role === "guardian") {
      const user = await prisma.userGuardian.findUnique({
        where: { guardian_email: String(email) },
      });
      if (!user) return res.status(404).json({ message: "User not found" });

      const { guardian_password, ...safeUser } = user;
      return res.status(200).json({ user: safeUser });
    }

    return res.status(400).json({ message: "Invalid role" });
  } catch (err) {
    console.error("Get user error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ====== UPDATE USER DATA WHEELCHAIR OR GUARDIAN DATA ======
app.put("/api/user", async (req, res) => {
  const { role, email, updates } = req.body;

  if (!role || !email || !updates) {
    return res
      .status(400)
      .json({ message: "Role, email, and updates are required" });
  }

  try {
    if (role === "wheelchair") {
      const user = await prisma.userWheelchair.findUnique({
        where: { user_email: email },
      });

      if (!user) return res.status(404).json({ message: "User not found" });

      const updatedUser = await prisma.userWheelchair.update({
        where: { user_email: email },
        data: updates,
      });

      const { user_password, ...safeUser } = updatedUser;
      return res
        .status(200)
        .json({ message: "User updated successfully", user: safeUser });
    }

    if (role === "guardian") {
      const user = await prisma.userGuardian.findUnique({
        where: { guardian_email: email },
      });

      if (!user) return res.status(404).json({ message: "User not found" });

      const updatedUser = await prisma.userGuardian.update({
        where: { guardian_email: email },
        data: updates,
      });

      const { guardian_password, ...safeUser } = updatedUser;
      return res
        .status(200)
        .json({ message: "User updated successfully", user: safeUser });
    }

    return res.status(400).json({ message: "Invalid role" });
  } catch (err) {
    console.error("Update user error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});
// ====== POST USER ALERT NOTIFICATION ======
app.post("/api/user_alert_notification", async (req, res) => {
  const { safewheel_id, alert_timestamp } = req.body;

  if (!safewheel_id) {
    return res
      .status(400)
      .json({ message: "safewheel_id is required" });
  }

  try {
    // Pastikan safewheel_id valid
    const wheelchairUser = await prisma.userWheelchair.findUnique({
      where: { safewheel_id },
    });

    if (!wheelchairUser) {
      return res.status(404).json({ message: "safewheel_id not found" });
    }

    // Gunakan alert_timestamp jika diberikan, kalau tidak pakai Date.now()
    const timestamp = alert_timestamp ? new Date(alert_timestamp) : new Date();

    // Simpan notifikasi alert
    const alertNotification = await prisma.userAlertNotification.create({
      data: {
        safewheel_id,
        alert_timestamp: timestamp,
      },
    });

    // Ambil semua guardian yang punya expo_token
    const guardians = await prisma.userGuardian.findMany({
      where: { safewheel_id },
      select: { guardian_email: true, expo_token: true },
    });

    // Kirim notifikasi push ke guardian
    for (const guardian of guardians) {
      if (guardian.expo_token) {
        await sendPushNotification(
          guardian.expo_token,
          "🚨 Emergency Alert",
          `Wheelchair user with ID ${safewheel_id} may need help.`
        );
      }
    }

    // Sukses
    return res.status(201).json({
      message: "Alert notification created successfully",
      alert: alertNotification,
    });
  } catch (err) {
    console.error("Alert notification error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ====== GET USER ALERT NOTIFICATION ======
app.get("/api/user_alert_notification", async (req, res) => {
  const { safewheel_id } = req.query;

  if (!safewheel_id) {
    return res.status(400).json({ message: "safewheel_id is required" });
  }

  try {
    // Get the alert notifications for the given safewheel_id
    const alerts = await prisma.userAlertNotification.findMany({
      where: { safewheel_id },
      orderBy: { alert_timestamp: "desc" },
    });

    if (alerts.length === 0) {
      return res
        .status(404)
        .json({ message: "No alerts found for this safewheel_id" });
    }

    res.status(200).json({ alerts });
  } catch (err) {
    console.error("Get alerts error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// ====== POST TOKEN (guardian or wheelchair) ======
app.post("/api/expo-token", async (req, res) => {
  const { email, expo_token, role } = req.body;

  if (!email || !expo_token || !role) {
    return res.status(400).json({ message: "email, role, and expo_token are required." });
  }

  try {
    let updatedUser;

    if (role === "guardian") {
      const existing = await prisma.userGuardian.findUnique({
        where: { guardian_email: email },
      });
      if (!existing) return res.status(404).json({ message: "Guardian not found." });

      updatedUser = await prisma.userGuardian.update({
        where: { guardian_email: email },
        data: { expo_token },
      });
    } else if (role === "wheelchair") {
      const existing = await prisma.userWheelchair.findUnique({
        where: { user_email: email },
      });
      if (!existing) return res.status(404).json({ message: "Wheelchair user not found." });

      updatedUser = await prisma.userWheelchair.update({
        where: { user_email: email },
        data: { expo_token },
      });
    } else {
      return res.status(400).json({ message: "Invalid role provided." });
    }

    return res.status(200).json({ message: "Expo token saved successfully.", data: updatedUser });
  } catch (error) {
    console.error("Failed to update expo_token:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
// ====== GET user safewheel name by safewheel id ======
app.get("/api/user/safewheel_name", async (req, res) => {
  const { safewheel_id } = req.query;

  if (!safewheel_id) {
    return res.status(400).json({ message: "safewheel_id is required" });
  }

  try {
    const user = await prisma.userWheelchair.findUnique({
      where: { safewheel_id },
      select: { user_name: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user_name: user.user_name });
  } catch (err) {
    console.error("Get user name error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ====== POST health_item ======
// POST /api/health_item
app.post("/api/health_item", async (req, res) => {
  const { safewheel_id, user_timestamp, oxylevel, heartrate } = req.body;

  if (
    !safewheel_id ||
    !user_timestamp ||
    oxylevel == null ||
    heartrate == null
  ) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Check if the safewheel_id exists in user_wheelchair
    const wheelchairUser = await prisma.userWheelchair.findUnique({
      where: { safewheel_id },
    });

    if (!wheelchairUser) {
      return res.status(404).json({ message: "safewheel_id not found" });
    }

    // Create the health item record
    const healthItem = await prisma.healthItem.create({
      data: {
        safewheel_id,
        user_timestamp: new Date(user_timestamp),
        oxylevel,
        heartrate,
      },
    });

    res.status(201).json({
      message: "Health item created successfully",
      healthItem,
    });
  } catch (err) {
    console.error("Health item creation error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ====== GET health_item ======
// GET /api/health_item
app.get("/api/health_item", async (req, res) => {
  const { safewheel_id } = req.query;

  if (!safewheel_id) {
    return res.status(400).json({ message: "safewheel_id is required." });
  }

  try {
    // Get the most recent health item for the given safewheel_id
    const latestHealthItem = await prisma.healthItem.findFirst({
      where: { safewheel_id },
      orderBy: { user_timestamp: "desc" },
    });

    if (!latestHealthItem) {
      return res
        .status(404)
        .json({ message: "No health items found for this safewheel_id." });
    }

    res.status(200).json({ healthItem: latestHealthItem });
  } catch (err) {
    console.error("Get health item error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ====== GET all health_item by safewheel_id======
app.get("/api/health_item/all", async (req, res) => {
  const { safewheel_id } = req.query;

  if (!safewheel_id) {
    return res.status(400).json({ message: "safewheel_id is required." });
  }

  try {
    // Get all health items for the given safewheel_id
    const healthItems = await prisma.healthItem.findMany({
      where: { safewheel_id },
      orderBy: { user_timestamp: "desc" },
    });

    if (healthItems.length === 0) {
      return res
        .status(404)
        .json({ message: "No health items found for this safewheel_id." });
    }

    res.status(200).json({ healthItems });
  } catch (err) {
    console.error("Get all health items error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ====== PUT LOCATION USER ======
app.put("/api/user_location", async (req, res) => {
  const { safewheel_id, location_coordinates } = req.body;

  if (!safewheel_id || !location_coordinates) {
    return res
      .status(400)
      .json({ message: "safewheel_id and location_coordinates are required" });
  }

  try {
    // Update the user's location
    const updatedUser = await prisma.userWheelchair.update({
      where: { safewheel_id },
      data: { location_coordinates },
    });

    res.status(200).json({
      message: "User location updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Update user location error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// ====== GET LOCATION USER ======
app.get("/api/user_location", async (req, res) => {
  const { safewheel_id } = req.query;

  if (!safewheel_id) {
    return res.status(400).json({ message: "safewheel_id is required" });
  }

  try {
    // Get the user's location
    const user = await prisma.userWheelchair.findUnique({
      where: { safewheel_id },
      select: { location_coordinates: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ location_coordinates: user.location_coordinates });
  } catch (err) {
    console.error("Get user location error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running`);
});
