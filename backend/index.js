import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
//MADE THE APP
const app = express();
const PORT = process.env.PORT || 5000;
//CONNECCT WITH THE DATABASE
mongoose.connect(process.env.ATLAS,{
    usenewurlparser:true,
}).then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.error("❌ MongoDB Error:", err));
app.get("/ping", (req, res) => {
    res.json({ msg: "pong" });
  });

  //start server
  app.listen(PORT,() =>{
    console.log(`✅ Server is running on port ${PORT}`);
  });
