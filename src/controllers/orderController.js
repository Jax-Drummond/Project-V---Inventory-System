/**
 * @file orderController.js
 * @description All the routes functionality for the order.
 * @author Owen, Jax
 * @version 1.1.2
 * @date 2025-10-19
 * @module OrderController
 */

import InventoryService from "../services/inventoryService.js";

/**
 * Controls all of the functionality for the order endpoints.
 * @class
 */
class OrderController {
    /**
     * Gets all the order.
     * @param {object} req The request.
     * @param {object} res The response.
     */
    static async getAllOrders(req, res) {
        try {
            const order = await InventoryService.getAllOrders();
            res.status(200).json(order);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    /**
     * Gets order by id.
     * @param {object} req The request.
     * @param {object} res The response.
     * @returns A response.
     */
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

    /**
     * Creates a new order.
     * @param {object} req The request.
     * @param {object} res The response.
     * @returns A response.
     */
    static async createOrder(req, res) {
        try {
            const { productId, qty, status } = req.body;
            // Validate stock existence via service
            const stock = await InventoryService.getStockById(productId);
            if (!stock) {
                return res.status(404).json({ message: "Stock not found" });
            }

            const newOrder = await InventoryService.createOrder({ productId: stock.productId, qty, status });

            res.status(201).json(newOrder);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    /**
     * Updates an order.
     * @param {object} req The request.
     * @param {object} res The Response.
     * @returns A response.
     */
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

    /**
     * Deletes an order.
     * @param {object} req The request.
     * @param {object} res The response.
     * @returns A response.
     */
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