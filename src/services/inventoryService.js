import fetch from "node-fetch";
const BASE_URL = "http://projectv.space:3000/api/";

class InventoryService {

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

    static async getProductById(id) {
        const products = await this.getAllProducts();
        return products.find(p => p.id === parseInt(id));
    }

    static async getProductsByName(partialName) {
        const products = await this.getAllProducts();
        const lowerName = partialName.toLowerCase();
        return products.filter(p => p.name.toLowerCase().includes(lowerName));
    }


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

    static async getStockById(id) {
        const stocks = await this.getAllStock();
        return stocks.find(s => s.id === parseInt(id)) || null;
    }

    static async getStockByProductId(id) {
        const stocks = await this.getAllStock();
        return stocks.find(s => s.productId === parseInt(id)) || null;
    }

    static async createStock(data) {
        const payload = {
            productId: data.productId,
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

    static async updateStock(id, data) {
        // Remove later -- Database logic messed up
        const stock = await this.getStockByProductId(id)
        id = stock.id

        const payload = {
            productid: data.productId,
            qty: data.qty,
            restock: data.threshold
        };

        await this._fetch(`inventory/product-stock/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(payload)
        });

        return this.getStockById(id);
    }

    static async deleteStock(id) {
        const data = await this._fetch(`inventory/product-stock/${id}`, { method: 'DELETE' });
        return !!data;
    }

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

    static async getOrderById(id) {
        const orders = await this.getAllOrders();
        return orders.find(o => o.id === parseInt(id)) || null;
    }

    static async createOrder(data) {
        const payload = {
            productid: data.productId || (data.Stock ? data.Stock.productId : null),
            qty: data.qty,
            suppliername: data.status,
            ordered: new Date().toISOString().slice(0, 10)
        };

        const res = await this._fetch('inventory/stock-order', {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return res;
    }

    static async updateOrderStatus(id, status) {
        await this._fetch(`inventory/stock-order/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({
                received: status.toLowerCase() == "received" ? new Date().toISOString().slice(0, 10) : "0-0-0",
                suppliername: status
            })
        });
        return this.getOrderById(id);
    }

    static async deleteOrder(id) {
        const res = await this._fetch(`inventory/stock-order/${id}`, { method: 'DELETE' });
        return !!res;
    }

    static async getAllEquipment() {
        const data = await this._fetch('fleet/equipment');
        if (!data) return [];

        return data.map(e => ({
            id: e.EquipmentCode,
            name: e.EquipmentName,
            status: e.EquipmentAvailability,
            type: e.EquipmentType
        }));
    }

    static async getEquipmentById(id) {
        const equipment = await this.getAllEquipment();
        return equipment.find(e => e.id === parseInt(id)) || null;
    }

    static async getEquipmentByPartialName(partialName) {
        const equipment = await this.getAllEquipment();
        const lowerName = partialName.toLowerCase();
        return equipment.filter(e => e.name.toLowerCase().includes(lowerName));
    }

    static async updateEquipmentStatus(id, data)
    {
        await this._fetch(`fleet/equipment/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({
                availability: data.status,
            })
        });
        return this.getEquipmentById(id);
    }

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