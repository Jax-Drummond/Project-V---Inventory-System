import ProductModel from "../models/productModel.js";
import StockModel from "../models/stockModel.js";
import {Op} from "sequelize"

class StockController
{
    static async getAllStock(req, res)
    {
        try
        {
            const stock = await StockModel.findAll(
                {
                    include:
                    {
                        model: ProductModel
                    }
                }
            )
            res.status(200).json(stock)
        } catch (e)
        {
            res.status(500).json({error: e.message})
        }
    }

    static async getStockByID(req, res)
        {
            try
            {
                const stock = await StockModel.findByPk(req.params.id,
                {
                    include:
                    {
                        model: ProductModel
                    }
                }
                )
                if (!stock)
                {
                    return res.status(404).json({message: "Item not found."})
                }
                res.status(200).json(stock)
            }
            catch(e)
            {
                res.status(500).json({error: e.message})
            }
        }

        static async createStock(req, res) {
            try {
                const {qty, threshold, price, productId} = req.body;

                if (!qty || !productId) {
                    return res.status(400).json ({ message: "Missing Fields"})
                }

                const product = await ProductModel.findByPk(productId);
                if (!product) {
                    return res.status(404).json({ message: "Product not found."});
                }

                const newStock = await StockModel.create({
                    qty,
                    threshold: threshold || 0,
                    price: price || 0,
                    productId
                });

                res.status(500).json ({
                    message: "Stock Created",
                    stock: newStock
                });
            } catch (e) {
                res.status(500).json({error: e.message});
            }
        }

        static async updateStock(req, res) {
            try {
                const {id} = req.params;
                const {qty, threshold, price} = req.body;

                const stock = await StockModel.findByPk(id);
                if (!stock) {
                    return res.status(404).json({message: "Stock not found."});
                }

                if (qty !== undefined) stock.qty = qty;
                if (threshold !== undefined) stock.threshold = threshold;
                if (price !== undefined) stock.price = price;

                await stock.save();

                res.status(200).json ({
                    message: "Stock updated",
                    stock
                });
            } catch (e) {
                res.status(500).json({error: e.message});
            }
        }

        static async deleteStock(req, res) {
            try {
                const {id} = req.params;
                const stock = await StockModel.findByPk(id);

                if (!stock) {
                    return res.status(404).json({message: "Stock not found"});
                }

                await stock.destroy();
                res.status(200).json({message: "Stock deleted"});
            } catch (e) {
                res.status(500).json({error: e.message});
            }
        }
        
}

export default StockController