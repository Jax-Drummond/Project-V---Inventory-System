/**
 * @file productRoutes.js
 * @description All the routes for the product.
 * @author Jax, Kahlib
 * @version 1.0.0
 * @date 2025-9-24
 * @module router
 */

import express from "express"
import ProductController from "../controllers/productController.js"

const router = express.Router()

// Get all products
router.get("/", ProductController.getAllProducts);

// Search products by partial name (query param: ?name=...)
router.get("/search", ProductController.getProductByPartialName);

// Get single product by ID (route param)
router.get("/:id", ProductController.getProductByID);

export default router;