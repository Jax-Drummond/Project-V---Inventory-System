/**
 * @file dashboardController.js
 * @description All the routes functionality for the dashboard.
 * @author Kahlib
 * @version 1.0.2
 * @date 2025-11-30
 * @module DashboardController
 */
import InventoryService from "../services/inventoryService.js";

/**
 * Controls all of the functionality for the dashboard endpoints.
 * @class
 */
class DashboardController {
    /**
     * Gets the dashboards overview.
     * @param {object} req The request.
     * @param {object} res The response.
     */
    static async getOverview(req, res) {
        try {
            const data = await InventoryService.getDashboardOverview();
            res.status(200).json(data);
        } catch (error) {
            // Simple error message for now
            res.status(500).json({ error: error.message });
        }
    }
}

export default DashboardController;
