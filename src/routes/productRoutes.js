/**
 * @file productRoutes.js
 * @description All the routes for the product.
 * @author Jax, Kahlib
 * @version 1.0.0
 * @date 2025-9-24
 * @module routes/product
 */

import express from "express"
import ProductController from "../controllers/productController.js"

const router = express.Router()

/**
 * Retreives a list of all products in the inventory.
 * @name Get All Products
 * @route {GET} /api/products
 * @summary Fetch all products.
 * @returns {Array<Object>} 200 - An array of product objects.
 */
router.get("/", ProductController.getAllProducts);


/**
 * Creates a product.
 * @name Create a Product
 * @route {POST} /api/products
 * @summary Create a product.
 */
router.post("/", ProductController.createProduct);

/**
 * Searches for products using a partial name match.
 * @name Search Products
 * @route {GET} /api/products/search
 * @summary Search products by name.
 * @param {string} name.query.required - The partial string to match against product names (e.g., ?name=drill).
 * @returns {Array<Object>} 200 - An array of matching products.
 */
router.get("/search", ProductController.getProductByPartialName);

/**
 * Retrieves a single product details by its unique Database ID.
 * @name Get Product by ID
 * @route {GET} /api/products/:id
 * @summary Get specific product.
 * @param {string} id.path.required - The unique ID of the product.
 * @returns {Object} 200 - A single product object.
 * @returns {Error} 404 - Product not found.
 */
router.get("/:id", ProductController.getProductByID);

export default router;