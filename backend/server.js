import "./config/config.js";
import express from "express";
import mongoose from "mongoose";
import path from "path";
import cookieParser from "cookie-parser";
import { userRouter } from "./user/routes.js";

// await mongoose.connect(process.env.DB);
await mongoose.connect("mongodb+srv://jennydreamatrix:4K4vAdW2i0t24GF0@mycluster.ey1qs4d.mongodb.net/Dreamscape");
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
  console.log("Server running on Port: ", PORT);
});