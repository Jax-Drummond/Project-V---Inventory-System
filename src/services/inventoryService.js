/**
 * @file inventoryService.js
 * @description Acts as the adapter between our backend and the database team's backend.
 * @author Jax, Owen, Kahlib
 * @version 1.0.0
 * @date 2025-11-18
 * @module InventoryService
 */

import fetch from "node-fetch";
const BASE_URL = "http://projectv.space:3000/api/";

/**
 * Is essentially an adapter to communicate with the database's backend
 * @class
 */
class InventoryService {

    /**
     * Is the universal fetch used internally.
     * @param {string} endpoint The endpoint to fetch.
     * @param {object} options The extra options or data to send with the request.
     * @returns The data of the response or null.
     */
    static async _fetch(endpoint, options = {}) {
        try {
            const res = await fetch(`${BASE_URL}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            const data = await res.json();

            if (!data.success) {
                console.error(`API Error on ${endpoint}:`, data.message);
                return null;
            }
            return data.data;
        } catch (error) {
            console.error(`Network Error on ${endpoint}:`, error);
            return null;
        }
    }

    /**
     * Gets all products from the database. Also creates stocks for any products without one.
     * @returns A array of json product objects.
     */
    static async getAllProducts() {
        const productsData = await this._fetch('inventory/product');
        if (!productsData) return [];

        const stockData = await this._fetch('inventory/product-stock') || [];

        const existingStockProductIds = new Set(stockData.map(s => s.ProductID));

        const productsMissingStock = productsData.filter(p => !existingStockProductIds.has(p.ProductID));

        if (productsMissingStock.length > 0) {
            await Promise.all(productsMissingStock.map(p => {
                return this.createStock({
                    productId: p.ProductID,
                    qty: 15,             // Default quantity
                    threshold: 10       // Default threshold
                });
            }));
            console.log(`Created stock entries for ${productsMissingStock.length} new products.`);
        }

        return productsData.map(p => ({
            id: p.ProductID,
            name: p.ProductName,
            description: p.ProductDescription,
            price: parseFloat(p.Price)
        }));
    }

    /**
     * Creates a new product.
     * @param {object} data The data of the new product you want to create.
     * @returns The response.
     */
    static async createProduct(data) {
        const payload = {
            name: data.name,
            price: data.price,
            description: data.description
        };
        const response = await this._fetch('inventory/product', {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        if (response && response.ProductID) {
            // Also create a default stock entry for the new product
            await this.createStock({
                productId: response.ProductID,
                qty: 15,
                threshold: 10
            });
            console.log(`[Auto-Create] Created default stock for new Product ID ${response.ProductID}.`);
        }

        // The response usually contains the ID of the new entry
        return response;
    }

    /**
     * Gets a product by it's ID.
     * @param {number} id The id of the product you want to find.
     * @returns The product.
     */
    static async getProductById(id) {
        const products = await this.getAllProducts();
        return products.find(p => p.id === parseInt(id));
    }

    /**
     * Gets a product by it's name.
     * @param {string} partialName The name of the product.
     * @returns The product.
     */
    static async getProductsByName(partialName) {
        const products = await this.getAllProducts();
        const lowerName = partialName.toLowerCase();
        return products.filter(p => p.name.toLowerCase().includes(lowerName));
    }

    /**
     * Gets all stocks.
     * @returns An array of stock json objects.
     */
    static async getAllStock() {
        const data = await this._fetch('inventory/product-stock');
        if (!data) return [];

        return data.map(s => ({
            id: s.StockID,
            qty: s.QuantityAvailable,
            threshold: s.RestockThreshold,
            lastRestock: s.LastRestockDate,
            productId: s.ProductID,
            Product: {
                id: s.ProductID,
                name: s.ProductName,
                price: 0
            }
        }));
    }

    /**
     * Gets a stock by it's ID.
     * @param {number} id The ID of the stock.
     * @returns The stock.
     */
    static async getStockById(id) {
        const stocks = await this.getAllStock();
        return stocks.find(s => s.productId === parseInt(id)) || null;
    }


    /**
     * Using the data given, creates a new stock.
     * @param {object} data The data of the new stock you want to create.
     * @returns The response.
     */
    static async createStock(data) {
        const payload = {
            productid: data.productId,
            qty: data.qty,
            restock: data.threshold,
            lastRestock: new Date().toISOString().slice(0, 19).replace('T', ' ')
        };

        const response = await this._fetch('inventory/product-stock', {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        // Return the newly created object structure
        return { ...data, id: response ? response.productID : null };
    }

    /**
     * Updates an existing stock.
     * @param {number} id The ID of the stock you want to update.
     * @param {object} data The new data you want updated.
     * @returns The new updated stock.
     */
    static async updateStock(id, data) {

        const payload = {
            productid: id,
            qty: data.qty,
            restock: data.threshold
        };

        // We send the productId because database is using productId in query.
        await this._fetch(`inventory/product-stock/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(payload)
        });

        if (data && parseInt(data.qty) <= parseInt(data.threshold)) {

            const allOrders = await this.getAllOrders();
            const hasPendingOrder = allOrders.some(o =>
                o.productid === id && o.status.toLowerCase() !== 'received'
            );
            if (!hasPendingOrder)
            {
                console.log(`[Auto-Restock] Stock for Product ID ${id} is low (${data.qty} <= ${data.threshold}). Creating order...`);

                // Calculate a reorder amount
                const reorderQty = data.threshold > 0 ? data.threshold * 2 : 20;

                await this.createOrder({
                    productId: id,
                    qty: reorderQty,
                    status: 'Pending' // Maps to suppliername in createOrder
                });
            }else
            {
                console.log(`[Auto-Restock] Pending order already exists for Product ID ${stock.productId}. Skipping creation.`);
            }
        }

        return this.getStockById(id);
    }

    /**
     * Deletes a stock.
     * @param {number} id The ID of the stock you want to delete.
     * @returns Whether or not the stock was deleted.
     */
    static async deleteStock(id) {
        const data = await this._fetch(`inventory/product-stock/${id}`, { method: 'DELETE' });
        return !!data;
    }

    /**
     * Gets all orders.
     * @returns An array of order json objects.
     */
    static async getAllOrders() {
        const ordersData = await this._fetch('inventory/stock-order');
        if (!ordersData) return [];

        const products = await this.getAllProducts();
        const stocks = await this.getAllStock();

        return ordersData.map(o => {
            const product = products.find(p => p.id === o.ProductID);
            const stock = stocks.find(s => s.productId === o.ProductID);

            let status = "Pending";
            if (o.ReceivedAt && o.ReceivedAt !== "0000-00-00") status = "Received";

            return {
                id: o.StockOrderID,
                qty: o.QuantityOrdered,
                cost: product ? (product.price * o.QuantityOrdered) : 0,
                status: o.SupplierName,
                date: o.OrderedAt,
                receivedDate: o.ReceivedAt,
                stockId: stock ? stock.id : null,
                productId: o.ProductID,
                Product: product || null,
                Stock: stock || null
            };
        });
    }

    /**
     * Get an order by it's ID.
     * @param {number} id The ID of the object you want to get.
     * @returns The order.
     */
    static async getOrderById(id) {
        const orders = await this.getAllOrders();
        return orders.find(o => o.id === parseInt(id)) || null;
    }

    /**
     * Creates a new order.
     * @param {object} data The data of the order you want to create.
     * @returns The response.
     */
    static async createOrder(data) {
        const payload = {
            productid: data.productId,
            qty: data.qty,
            suppliername: data.status,
            ordered: new Date().toISOString().slice(0, 10),
            received: "0-0-0"
        };

        const res = await this._fetch('inventory/stock-order', {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return res;
    }

    /**
     * Updates the status of an order.
     * @param {number} id The ID of the order you want to update.
     * @param {string} status The new status of the order.
     * @returns The new updated order.
     */
    static async updateOrderStatus(id, status) {

        if (status.toLowerCase() === 'received') {
            const order = await this.getOrderById(id);
            // Ensure order exists and wasn't already received to avoid double counting
            if (order && order.status.toLowerCase() !== 'received') {
                const stock = await this.getStockById(order.productId);

                if (stock) {
                    const newQty = parseInt(stock.qty) + parseInt(order.qty);
                    console.log(`[Auto-Update] Receiving Order ${id}. Updating Stock for Product ${order.productId}: ${stock.qty} -> ${newQty}`);

                    // Call updateStock (Note: current implementation expects ProductID as first arg)
                    await this.updateStock(order.productId, {
                        productId: order.productId,
                        qty: newQty,
                        threshold: stock.threshold
                    });
                } else {
                    console.warn(`[Auto-Update] Could not find stock for Product ${order.productId} to update quantity.`);
                }
            }
        }
        await this._fetch(`inventory/stock-order/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({
                received: status.toLowerCase() == "received" ? new Date().toISOString().slice(0, 10) : "0-0-0",
                suppliername: status
            })
        });
        return this.getOrderById(id);
    }

    /**
     * Deletes an order.
     * @param {number} id The ID of the order you want to delete.
     * @returns Whether the order was deleted or not.
     */
    static async deleteOrder(id) {
        const res = await this._fetch(`inventory/stock-order/${id}`, { method: 'DELETE' });
        return !!res;
    }

    /**
     * Gets all equipment.
     * @returns An array of equipment json objects.
     */
    static async getAllEquipment() {
        const data = await this._fetch('fleet/equipment');
        if (!data) return [];

        return data.map(e => ({
            id: e.EquipmentCode,
            name: e.EquipmentName,
            status: e.EquipmentAvailability,
            type: e.EquipmentType,
            tempid: e.EquipmentID
        }));
    }

    /**
     * Gets an equipment by it's ID.
     * @param {number} id the ID of the equipment you want to get.
     * @returns The equipment.
     */
    static async getEquipmentById(id) {
        const equipment = await this.getAllEquipment();
        return equipment.find(e => e.id === id) || null;
    }

    /**
     * Gets an equipment by it's name.
     * @param {string} partialName The name of the equipment you want to get.
     * @returns The equipment.
     */
    static async getEquipmentByPartialName(partialName) {
        const equipment = await this.getAllEquipment();
        const lowerName = partialName.toLowerCase();
        return equipment.filter(e => e.name.toLowerCase().includes(lowerName));
    }

    /**
     * Updates the status of an equipment.
     * @param {number} id The ID of the equipment you want to update.
     * @param {object} data The new status of the equipment.
     * @returns The new updated equipment.
     */
    static async updateEquipmentStatus(id, data)
    {
        const equipment = await this.getEquipmentById(id)

        await this._fetch(`fleet/equipment/${equipment.tempid}`, {
            method: 'PATCH',
            body: JSON.stringify({
                availability: data.status,
            })
        });

        return this.getEquipmentById(id);
    }

    /**
     * Gets the information that is needed to be displayed on the dashboard.
     * @returns Required Information.
     */
    static async getDashboardOverview() {
        const [products, stocks, orders] = await Promise.all([
            this.getAllProducts(),
            this.getAllStock(),
            this.getAllOrders()
        ]);

        const totalProducts = products.length;
        const totalStockItems = stocks.reduce((sum, s) => sum + s.qty, 0);
        const totalOrders = orders.length;
        const lowStockCount = stocks.filter(s => s.qty <= s.threshold).length;

        const inventoryValue = stocks.reduce((sum, s) => {
            const product = products.find(p => p.id === s.productId);
            const price = product ? product.price : 0;
            return sum + (s.qty * price);
        }, 0);

        const now = new Date();
        const monthlyRevenue = [];

        for (let i = 11; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const year = d.getFullYear();
            const month = d.getMonth();
            const label = d.toLocaleString('default', { month: 'short' });

            const totalForMonth = orders
                .filter(o => {
                    const od = new Date(o.date);
                    return od.getFullYear() === year && od.getMonth() === month;
                })
                .reduce((sum, o) => sum + (o.cost || 0), 0);

            monthlyRevenue.push({ month: label, total: totalForMonth });
        }

        const salesByProduct = new Map();
        products.forEach(p => salesByProduct.set(p.id, 0));

        orders.forEach(order => {
            const pid = order.productId;
            const current = salesByProduct.get(pid) ?? 0;
            salesByProduct.set(pid, current + (order.qty || 0));
        });

        const productSales = products.map(p => ({
            id: p.id,
            name: p.name,
            unitsSold: salesByProduct.get(p.id) ?? 0
        }));

        const sorted = [...productSales].sort((a, b) => b.unitsSold - a.unitsSold);

        return {
            summary: {
                totalProducts,
                totalStockItems,
                totalOrders,
                lowStockCount,
                inventoryValue
            },
            monthlyRevenue,
            bestSellers: sorted.slice(0, 3),
            worstSellers: sorted.slice(-3).reverse()
        };
    }
}

export default InventoryService;