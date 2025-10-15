import express from "express";
import OrderController from "../controllers/orderController.js";

const router = express.Router();

// READ
router.get("/", OrderController.getAllOrders);
router.get("/:id", OrderController.getOrderByID);

// CREATE
router.post("/", OrderController.createOrder);

// UPDATE (status only)
router.put("/:id/status", OrderController.updateOrderStatus);

// DELETE
router.delete("/:id", OrderController.deleteOrder);

export default router;
