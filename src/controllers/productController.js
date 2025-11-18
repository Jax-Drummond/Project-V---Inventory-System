import InventoryService from "../services/inventoryService.js";

class ProductController {
    static async getAllProducts(req, res) {
        try {
            const products = await InventoryService.getAllProducts();
            res.status(200).json(products);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

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

    static async getProductByPartialName(req, res) {
        try {
            const { name } = req.query;
            if (!name) {
                return res.status(400).json({ message: "Name query is required" });
            }

            const products = await InventoryService.getProductsByName(name);
            res.status(200).json(products);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
}

export default ProductController;