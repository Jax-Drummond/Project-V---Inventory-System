/**
 * @file orderRoutes.js
 * @description All the routes for the orders.
 * @author Owen
 * @version 1.0.0
 * @date 2025-10-19
 * @module router
 */

import express from "express";
import OrderController from "../controllers/orderController.js";

const router = express.Router();

// READ
router.get("/", OrderController.getAllOrders);
router.get("/:id", OrderController.getOrderByID);

// CREATE
router.post("/", OrderController.createOrder);

// UPDATE (status only)
router.put("/:id", OrderController.updateOrderStatus);

// DELETE
router.delete("/:id", OrderController.deleteOrder);

export default router;
