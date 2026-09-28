import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import { SESSION_COOKIE_NAME } from "./config";
import { getDb, getDbMode, initDb } from "./db";
import { requireAuth } from "./middleware/auth";
import { appointmentsRouter } from "./routes/appointments";
import { authRouter } from "./routes/auth";
import { patientsRouter } from "./routes/patients";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// CORS: in dev, reflect any localhost/127.0.0.1 origin with credentials.
// In production (NODE_ENV=production), restrict to FRONTEND_URL.
// (Lesson learned from the HealingHere POC: allow any localhost port in dev.)
const LOCALHOST_ORIGIN = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i;
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // curl / server-to-server
      const frontendUrl = (process.env.FRONTEND_URL ?? "").trim();
      if (process.env.NODE_ENV === "production" && frontendUrl) {
        return callback(null, origin === frontendUrl);
      }
      if (LOCALHOST_ORIGIN.test(origin)) return callback(null, origin);
      if (frontendUrl && origin === frontendUrl) return callback(null, origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    name: SESSION_COOKIE_NAME,
    secret: process.env.SESSION_SECRET || "dentalcare-dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 12, // 12h
    },
  })
);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, mode: getDbModeSafe(), ts: new Date().toISOString() });
});

function getDbModeSafe(): string {
  try {
    return getDb().mode;
  } catch {
    return "uninitialized";
  }
}

app.use("/api/auth", authRouter);
app.use("/api/patients", requireAuth, patientsRouter);
app.use("/api/appointments", requireAuth, appointmentsRouter);

// 404 for unknown API routes
app.use("/api", (_req, res) => {
  res.status(404).json({ ok: false, message: "Not found" });
});

async function main(): Promise<void> {
  await initDb();
  app.listen(PORT, () => {
    console.log(`[server] listening on http://localhost:${PORT} (db mode: ${getDb().mode})`);
  });

  const shutdown = async () => {
    try {
      await getDb().close();
    } finally {
      process.exit(0);
    }
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err) => {
  console.error("[server] failed to start:", err);
  process.exit(1);
});
