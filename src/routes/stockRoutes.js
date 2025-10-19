import express from "express";
import StockController from "../controllers/stockController.js";

const router = express.Router();

// READ
router.get("/", StockController.getAllStock);
router.get("/:id", StockController.getStockByID);

// CREATE
router.post("/", StockController.createStock);

// UPDATE (qty, threshold, price)
router.put("/:id", StockController.updateStock);

// DELETE
router.delete("/:id", StockController.deleteStock);

export default router;
