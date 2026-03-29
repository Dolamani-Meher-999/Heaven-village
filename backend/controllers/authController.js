import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ─── HELPERS ───────────────────────────────────────────────────────────────────

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// Fields safe to return to client — never include password
const sanitizeUser = (user) => ({
  _id:        user._id,
  name:       user.name,
  email:      user.email,
  role:       user.role,
  phone:      user.phone,
  profileImage: user.profileImage,
  bio:        user.bio,
  isVerified: user.isVerified,
  isActive:   user.isActive,
  createdAt:  user.createdAt,
});

// ─── REGISTER ─────────────────────────────────────────────────────────────────

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    // 1. Basic input validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // 2. Whitelist roles — never trust client for admin assignment
    const allowedRoles = ["tenant", "owner"];
    const assignedRole = allowedRoles.includes(role) ? role : "tenant";

    // 3. Check duplicate email
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(password, 12); // 12 rounds > 10

    // 5. Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: assignedRole,
      phone: phone || "",
    });

    // 6. Respond — never send password
    res.status(201).json({
      message: "User registered successfully",
      token: generateToken(user._id),
      user: sanitizeUser(user),
    });

  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── LOGIN ────────────────────────────────────────────────────────────────────

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Basic input validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // 2. Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 3. Check account is active
    if (!user.isActive) {
      return res.status(403).json({ message: "Account has been deactivated. Contact support." });
    }

    // 4. Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 5. Respond — never send password
    res.status(200).json({
      message: "Login successful",
      token: generateToken(user._id),
      user: sanitizeUser(user),
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── GET CURRENT USER (for page refresh / token rehydration) ──────────────────

export const getMe = async (req, res) => {
  try {
    // req.user is already set by protect middleware
    res.status(200).json({ user: sanitizeUser(req.user) });
  } catch (error) {
    console.error("GetMe error:", error);
    res.status(500).json({ message: "Server error" });
  }
};