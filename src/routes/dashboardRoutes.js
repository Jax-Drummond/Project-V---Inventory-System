/**
 * @file dashboardRoutes.js
 * @description All the routes for the dashboard.
 * @author Kahlib
 * @version 1.0.0
 * @date 2025-11-30
 * @module router
 */

import express from "express";
import DashboardController from "../controllers/dashboardController.js";

const router = express.Router();

// GET /api/dashboard/overview
router.get("/overview", DashboardController.getOverview);

export default router;
