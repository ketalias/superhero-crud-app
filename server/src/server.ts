import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import superheroRoutes from "./routes/superheroes";
import { errorHandler } from './middlewares/errorHandler';



dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(errorHandler);

app.use("/superheroes", superheroRoutes);

mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/api/superheroes")
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));

app.use(errorHandler, (req: express.Request, res: express.Response) => {
  res.status(404).json({ error: "Not Found" });
});

