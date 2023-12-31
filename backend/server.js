import "./config/config.js";
import express from "express";
import mongoose from "mongoose";
import path from "path";
import cookieParser from "cookie-parser";
import { userRouter } from "./routes/UserRoutes.js";

await mongoose.connect(process.env.DB);
await mongoose.connection.syncIndexes();

const PORT = process.env.PORT || 3001;
const app = express();

const ReactAppDistPath = path.join(path.resolve(), "..", "frontend", "dist");
const ReactAppIndex = path.join(
  path.resolve(),
  "..",
  "frontend",
  "dist",
  "index.html"
);

app.use(express.json());
app.use(cookieParser());
app.use(express.static(ReactAppDistPath));
app.use("/api/user", userRouter);

app.get("/api/status", (req, res) => {
  res.send({ status: "Ok" });
});

app.get("/*", (req, res) => {
  res.sendFile(ReactAppIndex);
});

app.listen(PORT, () => {
  console.log("Server is running on Port: ", PORT);
});