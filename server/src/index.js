import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import http from "http";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import { Server } from "socket.io";
import { connectDb } from "./config/db.js";
import { errorHandler, notFound } from "./middleware/error.js";
import adminRoutes from "./routes/admin.js";
import aiRoutes from "./routes/ai.js";
import authRoutes from "./routes/auth.js";
import bookingRoutes from "./routes/bookings.js";
import deliveryRoutes from "./routes/deliveries.js";
import reviewRoutes from "./routes/reviews.js";
import vehicleRoutes from "./routes/vehicles.js";
import { configureSocket } from "./socket/index.js";

dotenv.config({ path: "../.env" });
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
  }
});

app.set("io", io);
configureSocket(io);

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "5mb" }));
app.use(morgan("dev"));
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "RideBridge API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/deliveries", deliveryRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ai", aiRoutes);
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

connectDb()
  .then(() => {
    server.listen(port, () => console.log(`API running on http://localhost:${port}`));
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
