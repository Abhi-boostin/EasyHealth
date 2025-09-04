import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
dotenv.config();

// MADE THE APP
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// CONNECT WITH DATABASE
mongoose
  .connect(process.env.ATLAS, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "easyhealth"
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// test
app.get("/api", (req, res) => {
  res.json({ msg: "working" });
});

// login api forwarding
app.use("/api/user", authRoutes);

//chat api forwarding
app.use("/api/chat", chatRoutes);

// location api forwarding
app.use("/api/location", locationRoutes);

// start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
