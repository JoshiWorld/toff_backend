import createError from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import dotenv from "dotenv";

import liveRouter from "./routes/live";
import masterRouter from "./routes/master";
import statsRouter from "./routes/stats";
// import contactRouter from "./routes/contact";
// import dealsRouter from "./routes/deals";

dotenv.config();

const app = express();

// Increase the request size limit for JSON data (e.g., 10MB)
app.use(express.json({ limit: "10mb" }));

// Increase the request size limit for URL-encoded data (e.g., 10MB)
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "https://toff-musik.de");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next(createError(404));
});

app.use("/api/live", liveRouter);
app.use("/api/master", masterRouter);
app.use("/api/stats", statsRouter);
// app.use("/api/contact", contactRouter);
// app.use("/api/deals", dealsRouter);

// Error handler
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render("error"); // Assuming 'error' is a valid pug template
});

export default app;
