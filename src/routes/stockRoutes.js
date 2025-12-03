/**
 * @file stockRoutes.js
 * @description All the routes for the stock.
 * @author Owen
 * @version 1.0.0
 * @date 2025-10-19
 * @module router
 */

import express from "express";
import StockController from "../controllers/stockController.js";

const router = express.Router();

// READ
router.get("/", StockController.getAllStock);
router.get("/:id", StockController.getStockByID);
router.get("/product/:id", StockController.getStockByProductID);

// CREATE
router.post("/", StockController.createStock);

// UPDATE (qty, threshold, price)
router.put("/:id", StockController.updateStock);

// DELETE
router.delete("/:id", StockController.deleteStock);

export default router;
