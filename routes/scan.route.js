import express from "express";
import { checkVulnerabilities } from "../controllers/scan.controller.js";

const router = express.Router();

router.post("/scan", checkVulnerabilities);

export default router;
