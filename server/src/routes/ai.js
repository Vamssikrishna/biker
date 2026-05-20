import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { askRentalAssistant } from "../services/ai/chatbot.js";
import { predictDemand } from "../services/ai/demand.js";
import { detectUserRisk } from "../services/ai/fraud.js";
import { calculateDynamicPrice } from "../services/ai/pricing.js";
import Vehicle from "../models/Vehicle.js";

const router = express.Router();

router.post("/chat", requireAuth, async (req, res, next) => {
  try {
    const answer = await askRentalAssistant(req.user, req.body.message);
    res.json({ answer });
  } catch (error) {
    next(error);
  }
});

router.get("/demand", requireAuth, async (req, res, next) => {
  try {
    const demand = await predictDemand();
    res.json({ demand });
  } catch (error) {
    next(error);
  }
});

router.get("/pricing/:vehicleId", requireAuth, async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.vehicleId);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    const price = await calculateDynamicPrice(vehicle, req.query);
    res.json({ price });
  } catch (error) {
    next(error);
  }
});

router.get("/risk", requireAuth, async (req, res, next) => {
  try {
    const risk = await detectUserRisk(req.user);
    res.json({ risk });
  } catch (error) {
    next(error);
  }
});

export default router;
