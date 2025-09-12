import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import superheroRoutes from "./routes/superheroes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/superheroes", superheroRoutes);

mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/superheroes")
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));
