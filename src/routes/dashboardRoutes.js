/**
 * @file dashboardRoutes.js
 * @description All the routes for the dashboard.
 * @author Kahlib
 * @version 1.0.0
 * @date 2025-11-30
 * @module routes/dashboard
 */

import express from "express";
import DashboardController from "../controllers/dashboardController.js";

const router = express.Router();

/**
 * Retrieves the high-level overview statistics for the dashboard.
 * @name Get Dashboard Overview
 * @route {GET} /api/dashboard/overview
 * @summary Fetch dashboard stats.
 * @returns {Object} 200 - An object containing overview metrics (total stock, recent orders, etc.).
 */
router.get("/overview", DashboardController.getOverview);

export default router;
