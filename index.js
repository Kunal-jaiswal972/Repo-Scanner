import cors from "cors";
import morgan from "morgan";
import express from "express";
import { config } from "dotenv";

import scanRoutes from "./routes/scan.route.js";

config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
app.use(morgan("dev"));
app.use("/api/v1", scanRoutes);

app.get("/", (req, res) => {
  res.status(201).json("hi from server");
});

app.listen(PORT, () => console.log(`Server Open On http://localhost:${PORT}`));
