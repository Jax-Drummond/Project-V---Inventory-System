import express from "express";
import DashboardController from "../controllers/dashboardController.js";

const router = express.Router();

// GET /api/dashboard/overview
router.get("/overview", DashboardController.getOverview);

export default router;
