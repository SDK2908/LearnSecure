import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import cors from "cors";

dotenv.config();
connectDB().then(() => {
  app.listen(5002, () => {
    console.log("Server started on PORT: 5002");
  });
});

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);

