import express from "express";
import cors from "cors";
import dotenv from "dotenv/config";
import mongoose from "mongoose";
import connectDb from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRouter.js";
import orderRouter from "./routes/orderRoute.js";

// App Config
const app = express();

connectDb();
connectCloudinary();

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "token", "Accept", "isdemo"],
  }),
);

// API Endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// Root route
app.get("/", (req, res) => {
  res.send("API working");
});

// Wake-up and Health Check Endpoint (keeps both Backend Server and MongoDB active)
app.get(["/api/health", "/api/ping", "/ping"], async (req, res) => {
  try {
    let dbStatus = "disconnected";
    let dbPingSuccess = false;

    // Check MongoDB connection state: 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
    if (mongoose.connection.readyState === 1) {
      dbStatus = "connected";
      // Perform a real database command to wake up / keep MongoDB Atlas connection alive
      if (mongoose.connection.db) {
        await mongoose.connection.db.command({ ping: 1 });
        dbPingSuccess = true;
      }
    } else if (mongoose.connection.readyState === 0) {
      // Reconnect if disconnected
      connectDb();
      dbStatus = "reconnecting";
    }

    return res.status(200).json({
      success: true,
      status: "online",
      message: "Backend server and Database are awake and active",
      server: {
        uptime: `${Math.floor(process.uptime())}s`,
        memoryUsage: `${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`,
      },
      database: {
        status: dbStatus,
        readyState: mongoose.connection.readyState,
        ping: dbPingSuccess ? "ok" : "pending",
        name: mongoose.connection.name || "e_commerce",
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      status: "degraded",
      message: "Health check encountered an error",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Auto Keep-Alive Cron (Pings every 14 minutes to prevent Render free-tier from sleeping after 15m)
const WAKEUP_INTERVAL_MS = 14 * 60 * 1000; // 14 minutes
const keepAliveUrl =
  process.env.RENDER_EXTERNAL_URL ||
  process.env.RENDER_BACKEND_URL ||
  "https://ecommerce-backend-eiq9.onrender.com";

const startKeepAliveCron = () => {
  console.log(`[Keep-Alive Cron] Initialized. Target: ${keepAliveUrl}/api/health (Every 14m)`);
  setInterval(async () => {
    try {
      const response = await fetch(`${keepAliveUrl}/api/health`);
      if (response.ok) {
        const data = await response.json();
        console.log(
          `[Keep-Alive Cron] Ping OK at ${new Date().toLocaleTimeString()} - DB: ${data.database?.status}`,
        );
      } else {
        console.warn(`[Keep-Alive Cron] Ping returned status: ${response.status}`);
      }
    } catch (err) {
      console.error(`[Keep-Alive Cron] Ping failed: ${err.message}`);
    }
  }, WAKEUP_INTERVAL_MS);
};

// Port & Server Listen
const port_val = Number(process.env.PORT) || 4000;
if (Number.isNaN(Number(process.env.PORT))) {
  console.warn(
    "process.env.PORT is not a valid number; falling back to",
    port_val,
  );
}

app.listen(port_val, () => {
  console.log("Server started on PORT: " + port_val);
  startKeepAliveCron();
});
