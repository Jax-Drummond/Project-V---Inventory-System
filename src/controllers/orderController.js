import ProductModel from "../models/productModel.js";
import StockModel from "../models/stockModel.js";
import OrderModel from "../models/orderModel.js";
import {Op} from "sequelize"

class OrderController
{
    static async getAllOrders(req, res)
    {
        try
        {
            const order = await OrderModel.findAll(
                {
                    include:
                    {
                        model: StockModel,
                        model: ProductModel
                    }
                }
            )
            res.status(200).json(order)
        } catch (e)
        {
            res.status(500).json({error: e.message})
        }
    }

    static async getOrderByID(req, res)
        {
            try
            {
                const order = await OrderModel.findByPk(req.params.id,
                {
                    include:
                    {
                        model: StockModel,
                        model: ProductModel
                    }
                }
                )
                if (!order)
                {
                    return res.status(404).json({message: "Order not found."})
                }
                res.status(200).json(order)
            }
            catch(e)
            {
                res.status(500).json({error: e.message})
            }
        }

        static async createOrder(req, res) 
        {
            try {
                const { qty, cost, status, stockId } = req.body;
                
                if (!productId || !quantity) {
                    return res.status(400).json({ message: "Missing fields." });
                }

                const stock = await StockModel.findByPk(stockId);
                if (!stock) {
                    return res.status(404).json({ message: "Stock not found"});
                }

                const newOrder = await OrderModel.create({
                    qty,
                    cost,
                    status,
                    date: new Date(),
                    stockId
                });

                res.status(201).json(newOrder);
            }   catch (e) {
                res.status(500).json({ error: e.message });
            }
        }

        static async updateOrderStatus(req, res) 
        {
            try
            {
                const { id } = req.params;
                const { status } = req.body;

                if (!status) {
                    return res.status(400).json({ message: "Missing new status."});
                }

                const order = await OrderModel.findByPk(id);

                if (!order) {
                    return res.status(404).json({message: "Order not found."});
                }
                
                order.status = status;
                await order.save();

                res.status(200).json({
                    message: "Order status updated successfully.", 
                    order
                });
            } catch (e) {
                res.status(500).json({error: e.message});
            }
        }

        static async deleteOrder(req, res) 
        {
            try {
                const {id} = req.params;
                const order = await OrderModel.findByPk(id);

                if (!order) {
                    return res.status(404).json({message: "Order not found."});
                }

                await order.destroy();
                res.status(200).json({message: "Order deleted successfully."});
            } catch (e) {
                res.status(500).json({error: e.message});
            }
        }
}

export default OrderController