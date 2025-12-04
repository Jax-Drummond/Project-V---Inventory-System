/**
 * @file stockController.js
 * @description All the routes functionality for the stock.
 * @author Owen, Jax
 * @version 1.1.2
 * @date 2025-10-19
 * @module StockController
 */

import InventoryService from "../services/inventoryService.js";

/**
 * Controls all of the functionality for the stock endpoints.
 * @class
 */
class StockController {
    /**
     * Gets all the stock.
     * @param {object} req The request.
     * @param {object} res The response.
     */
    static async getAllStock(req, res) {
        try {
            const stock = await InventoryService.getAllStock();
            res.status(200).json(stock);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    /**
     * Gets stock by id.
     * @param {object} req The request.
     * @param {object} res The response.
     * @returns A response.
     */
    static async getStockByID(req, res) {
        try {
            const stock = await InventoryService.getStockById(req.params.id);
            if (!stock) {
                return res.status(404).json({ message: "Item not found." });
            }
            res.status(200).json(stock);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }


    /**
     * Creates a new stock.
     * @param {object} req The request.
     * @param {object} res The response.
     * @returns A response.
     */
    static async createStock(req, res) {
        try {
            const { qty, threshold, price, productId } = req.body;

            if (!qty || !productId) {
                return res.status(400).json({ message: "Missing Fields" });
            }

            // Verify product exists via service
            const product = await InventoryService.getProductById(productId);
            if (!product) {
                return res.status(404).json({ message: "Product not found." });
            }

            const newStock = await InventoryService.createStock({ qty, threshold, price, productId });

            res.status(201).json({
                message: "Stock Created",
                stock: newStock
            });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    /**
     * Updates a stock.
     * @param {object} req The request.
     * @param {object} res The Response.
     * @returns A response.
     */
    static async updateStock(req, res) {
        try {
            const { id } = req.params;
            const { qty, threshold } = req.body;

            const updatedStock = await InventoryService.updateStock(id, { qty, threshold });

            if (!updatedStock) {
                return res.status(404).json({ message: "Stock not found." });
            }

            res.status(200).json({
                message: "Stock updated",
                stock: updatedStock
            });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    /**
     * Deletes a stock.
     * @param {object} req The request.
     * @param {object} res The response.
     * @returns A response.
     */
    static async deleteStock(req, res) {
        try {
            const { id } = req.params;
            const success = await InventoryService.deleteStock(id);

            if (!success) {
                return res.status(404).json({ message: "Stock not found" });
            }

            res.status(200).json({ message: "Stock deleted" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
}

export default StockController;