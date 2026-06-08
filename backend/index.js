import express from "express";
import { connectDB, getPractitioners, refreshPractitionerCache } from "./db.connection.js";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import userRouter from "./routes/user.route.js";
import paymentRouter from "./routes/payment.route.js";
import authRouter from "./routes/auth.route.js";
import calendarRouter from "./routes/calendar.route.js";
import cookieParser from "cookie-parser";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:15002", "https://embracelives.com", "https://www.embracelives.com"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

await connectDB();
// Cache practitioner data in memory for fast access
await refreshPractitionerCache();

app.use("/backendEmb/user", userRouter);
app.use("/backendEmb/payment", paymentRouter);
app.use("/backendEMb/auth", authRouter);
app.use("/backendEMb/calendar", calendarRouter);

// Serve frontend static files from embrace_clone directory
const frontendPath = path.join(__dirname, "..", "embrace_clone");
app.use(express.static(frontendPath));

// SPA fallback - serve route-specific prerendered HTML when available
app.use((req, res, next) => {
  if (req.path.startsWith("/backendEmb") || req.path.startsWith("/backendEMb")) {
    return next();
  }
  if (req.method === "GET") {
    // Don't serve index.html for missing static files (images, etc.)
    const ext = path.extname(req.path);
    if (ext && [".jpg", ".jpeg", ".png", ".gif", ".svg", ".webp", ".ico", ".css", ".js", ".woff", ".woff2", ".ttf", ".eot"].includes(ext.toLowerCase())) {
      const fullPath = path.join(frontendPath, req.path);
      if (fs.existsSync(fullPath)) {
        return res.sendFile(fullPath);
      }
      return res.status(404).end();
    }
    // Map route path to HTML file (e.g. /appointment/confirmation -> appointment__confirmation.html)
    const routeFile = req.path === "/" ? "index" : req.path.slice(1).replace(/\//g, "__");
    const htmlPath = path.join(frontendPath, "pages", `${routeFile}.html`);
    if (fs.existsSync(htmlPath)) {
      return res.sendFile(htmlPath);
    }
    return res.sendFile(path.join(frontendPath, "pages", "index.html"));
  }
  next();
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log(`Frontend: http://localhost:${PORT}`);
  console.log(`API: http://localhost:${PORT}/backendEmb/user`);
});
