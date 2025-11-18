import InventoryService from "../services/inventoryService.js";

class OrderController {
    static async getAllOrders(req, res) {
        try {
            const order = await InventoryService.getAllOrders();
            res.status(200).json(order);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async getOrderByID(req, res) {
        try {
            const order = await InventoryService.getOrderById(req.params.id);
            if (!order) {
                return res.status(404).json({ message: "Order not found." });
            }
            res.status(200).json(order);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async createOrder(req, res) {
        try {
            const { qty, cost, status, stockId } = req.body;

            // Validate stock existence via service
            const stock = await InventoryService.getStockById(stockId);
            if (!stock) {
                return res.status(404).json({ message: "Stock not found" });
            }

            const newOrder = await InventoryService.createOrder({ qty, cost, status, stockId });

            res.status(201).json(newOrder);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async updateOrderStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!status) {
                return res.status(400).json({ message: "Missing new status." });
            }

            const updatedOrder = await InventoryService.updateOrderStatus(id, status);

            if (!updatedOrder) {
                return res.status(404).json({ message: "Order not found." });
            }

            res.status(200).json({
                message: "Order status updated successfully.",
                order: updatedOrder
            });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async deleteOrder(req, res) {
        try {
            const { id } = req.params;
            const success = await InventoryService.deleteOrder(id);

            if (!success) {
                return res.status(404).json({ message: "Order not found." });
            }

            res.status(200).json({ message: "Order deleted successfully." });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
}

export default OrderController;