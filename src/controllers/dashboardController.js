import InventoryService from "../services/inventoryService.js";

class DashboardController {
    // Handles GET /api/dashboard/overview
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
