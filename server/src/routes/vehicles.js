import express from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import Vehicle from "../models/Vehicle.js";
import { recommendVehicles } from "../services/ai/recommendation.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const { city, type, minPrice, maxPrice, q, owner, includePending } = req.query;
    const filter = {};

    if (type) filter.type = type;
    if (city) filter["location.city"] = new RegExp(city, "i");
    if (owner) filter.owner = owner;
    if (includePending !== "true") filter.approvalStatus = "approved";
    if (req.query.availability) {
      filter.availability = req.query.availability;
    } else if (!owner) {
      filter.availability = "available";
    }
    if (minPrice || maxPrice) {
      filter.pricePerHour = {};
      if (minPrice) filter.pricePerHour.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerHour.$lte = Number(maxPrice);
    }
    if (q) {
      filter.$or = [
        { brand: new RegExp(q, "i") },
        { model: new RegExp(q, "i") },
        { description: new RegExp(q, "i") }
      ];
    }

    const vehicles = await Vehicle.find(filter).populate("owner", "name rating phone location").sort("-rating -createdAt");
    res.json({ vehicles });
  } catch (error) {
    next(error);
  }
});

router.get("/recommendations", requireAuth, async (req, res, next) => {
  try {
    const vehicles = await recommendVehicles(req.user, req.query);
    res.json({ vehicles });
  } catch (error) {
    next(error);
  }
});

router.post("/", requireAuth, requireRole("owner", "admin"), async (req, res, next) => {
  try {
    const vehicle = await Vehicle.create({
      ...req.body,
      owner: req.user._id,
      approvalStatus: req.user.role === "admin" ? "approved" : "pending"
    });
    res.status(201).json({ vehicle });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate("owner", "name rating phone location");
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    res.json({ vehicle });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", requireAuth, async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    if (String(vehicle.owner) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Only the owner or admin can update this vehicle" });
    }

    Object.assign(vehicle, req.body);
    await vehicle.save();
    res.json({ vehicle });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    if (String(vehicle.owner) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Only the owner or admin can delete this vehicle" });
    }
    await vehicle.deleteOne();
    res.json({ message: "Vehicle removed" });
  } catch (error) {
    next(error);
  }
});

export default router;
