/**
 * @file orderRoutes.js
 * @description All the routes for the orders.
 * @author Owen
 * @version 1.0.0
 * @date 2025-10-19
 * @module routes/orders
 */

import express from "express";
import OrderController from "../controllers/orderController.js";

const router = express.Router();

/**
 * Retrieves a list of all orders.
 * @name Get All Orders
 * @route {GET} /api/orders
 * @summary Get complete order history.
 * @returns {Array<Object>} 200 - An array of order objects.
 */
router.get("/", OrderController.getAllOrders);

/**
 * Retrieves a specific order by its ID.
 * @name Get Order by ID
 * @route {GET} /api/orders/:id
 * @summary Get order details.
 * @param {string} id.path.required - The unique Order ID.
 * @returns {Object} 200 - The order object.
 */
router.get("/:id", OrderController.getOrderByID);

/**
 * Creates a new order in the system.
 * @name Create Order
 * @route {POST} /api/orders
 * @summary Create a new order.
 * @param {Object} request.body.required - The order details (items, customer, date).
 * @returns {Object} 201 - The created order.
 */
router.post("/", OrderController.createOrder);

/**
 * Updates the status of an existing order.
 * @name Update Order Status
 * @route {PUT} /api/orders/:id
 * @summary Update order status.
 * @param {string} id.path.required - The unique Order ID.
 * @param {string} status.body.required - The new status (e.g., "Shipped", "Delivered").
 * @returns {Object} 200 - The updated order.
 */
router.put("/:id", OrderController.updateOrderStatus);

/**
 * Deletes an order from the system.
 * @name Delete Order
 * @route {DELETE} /api/orders/:id
 * @summary Remove an order.
 * @param {string} id.path.required - The unique Order ID.
 * @returns {Object} 200 - Success message.
 */
router.delete("/:id", OrderController.deleteOrder);

export default router;
