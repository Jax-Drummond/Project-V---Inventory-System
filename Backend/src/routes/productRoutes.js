import express from "express"
import ProductController from "../controllers/productController.js"

const router = express.Router()

// Get all products
router.get("/", ProductController.getAllProducts);

// Search products by partial name (query param: ?name=...)
router.get("/search", ProductController.getProductByPartialName);

// Get single product by ID (route param)
router.get("/:id", ProductController.getProductByID);

// Create new product
router.post("/", ProductController.createProduct);

// Update product by ID
router.put("/:id", ProductController.updateProduct);

// Delete product by ID
router.delete("/:id", ProductController.deleteProduct);

export default router;