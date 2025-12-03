/**
 * @file stockRoutes.js
 * @description All the routes for the stock.
 * @author Owen
 * @version 1.0.0
 * @date 2025-10-19
 * @module routes/stock
 */

import express from "express";
import StockController from "../controllers/stockController.js";

const router = express.Router();

/**
 * Retrieves a list of all current stock items.
 * @name Get All Stock
 * @route {GET} /api/stock
 * @summary Get all stock inventory.
 * @returns {Array<Object>} 200 - An array of stock objects.
 */
router.get("/", StockController.getAllStock);

/**
 * Retrieves a single stock item by its unique ID.
 * @name Get Stock by ID
 * @route {GET} /api/stock/:id
 * @summary Get stock item details.
 * @param {string} id.path.required - The unique ID of the stock entry.
 * @returns {Object} 200 - A single stock object.
 */
router.get("/:id", StockController.getStockByID);

/**
 * Retrieves the stock entry associated with a specific Product ID.
 * @name Get Stock by Product ID
 * @route {GET} /api/stock/product/:id
 * @summary Find stock for a specific product.
 * @param {string} id.path.required - The unique Product ID.
 * @returns {Object} 200 - The stock object for that product.
 */
router.get("/product/:id", StockController.getStockByProductID);

/**
 * Creates a new stock entry in the inventory.
 * @name Create Stock
 * @route {POST} /api/stock
 * @summary Create new stock.
 * @param {Object} request.body.required - The stock information (productId, quantity, etc.).
 * @returns {Object} 201 - The created stock object.
 */
router.post("/", StockController.createStock);

/**
 * Updates an existing stock entry (Quantity, Threshold, Price).
 * @name Update Stock
 * @route {PUT} /api/stock/:id
 * @summary Update stock details.
 * @param {string} id.path.required - The unique ID of the stock entry to update.
 * @param {Object} request.body.required - Fields to update (qty, threshold, price).
 * @returns {Object} 200 - The updated stock object.
 */
router.put("/:id", StockController.updateStock);

/**
 * Deletes a stock entry from the system.
 * @name Delete Stock
 * @route {DELETE} /api/stock/:id
 * @summary Remove stock entry.
 * @param {string} id.path.required - The unique ID of the stock entry.
 * @returns {Object} 200 - Success message.
 */
router.delete("/:id", StockController.deleteStock);

export default router;
