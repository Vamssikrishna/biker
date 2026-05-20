import express from "express";
import { requireAuth, signToken } from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

function publicUser(user) {
  const data = user.toObject ? user.toObject() : user;
  delete data.password;
  return data;
}

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password, phone, role = "customer", location } = req.body;
    const allowedRoles = ["customer", "owner", "rider"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid registration role" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already registered" });

    const user = await User.create({ name, email, password, phone, role, location });
    res.status(201).json({ user: publicUser(user), token: signToken(user) });
  } catch (error) {
    next(error);
  }
});

router.get("/admin-status", async (req, res, next) => {
  try {
    const adminExists = await User.exists({ role: "admin" });
    res.json({ adminExists: Boolean(adminExists) });
  } catch (error) {
    next(error);
  }
});

router.post("/setup-admin", async (req, res, next) => {
  try {
    const adminExists = await User.exists({ role: "admin" });
    if (adminExists) {
      return res.status(409).json({ message: "Admin account is already configured" });
    }

    const { name, email, password, phone } = req.body;
    const user = await User.create({ name, email, password, phone, role: "admin" });
    res.status(201).json({ user: publicUser(user), token: signToken(user) });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({ user: publicUser(user), token: signToken(user) });
  } catch (error) {
    next(error);
  }
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

router.patch("/me", requireAuth, async (req, res, next) => {
  try {
    const allowed = ["name", "phone", "avatar", "location", "availability"];
    const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select("-password");
    res.json({ user });
  } catch (error) {
    next(error);
  }
});

export default router;
