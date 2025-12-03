/**
 * @file productController.js
 * @description All the routes functionality for the product.
 * @author Jax
 * @version 1.1.1
 * @date 2025-9-24
 * @module ProductController
 */

import InventoryService from "../services/inventoryService.js";

/**
 * Controls all of the functionality for the product endpoints.
 * @class
 */
class ProductController {
    /**
     * Gets all the product.
     * @param {object} req The request.
     * @param {object} res The response.
     */
    static async getAllProducts(req, res) {
        try {
            const products = await InventoryService.getAllProducts();
            res.status(200).json(products);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    /**
     * Gets product by id.
     * @param {object} req The request.
     * @param {object} res The response.
     * @returns A response.
     */
    static async getProductByID(req, res) {
        try {
            const product = await InventoryService.getProductById(req.params.id);
            if (!product) {
                return res.status(404).json({ message: "Product not found." });
            }
            res.status(200).json(product);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

     /**
     * Gets product by name.
     * @param {object} req The request.
     * @param {object} res The response.
     * @returns A response.
     */
    static async getProductByPartialName(req, res) {
        try {
            const { name } = req.query;
            if (!name) {
                return res.status(400).json({ message: "Name query is required" });
            }

            const products = await InventoryService.getProductsByName(name);

            if (!products[0])
            {
                return res.status(404).json({message: "No products found."});
            }

            res.status(200).json(products);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
}

export default ProductController;