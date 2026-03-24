const express = require("express");
const cors = require("cors");

const healthRouter = require("./routes/health");
const mediaRouter = require("./routes/media");
const authRouter = require("./routes/auth");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

const app = express();
const corsOriginList = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
  : [];
const useWildcardCors = corsOriginList.length === 0;

app.use(
  cors({
    origin: useWildcardCors ? "*" : corsOriginList,
    credentials: !useWildcardCors,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.status(200).json({
    ok: true,
    service: "black_bullet_backend",
    message: "Server initialized",
  });
});

app.use("/api/health", healthRouter);
app.use("/api/admin/auth", authRouter);
app.use("/api/media", mediaRouter);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
