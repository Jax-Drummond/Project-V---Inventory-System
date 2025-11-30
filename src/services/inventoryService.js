const BASE_URL = "http://localhost:3000/api/inventory";

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
        const data = await this._fetch('/product');
        if (!data) return [];

        return data.map(p => ({
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
        const data = await this._fetch('/productstock');
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

    static async createStock(data) {
        const payload = {
            productid: data.productId,
            qty: data.qty,
            restock: data.threshold,
            lastrestock: new Date().toISOString().slice(0, 19).replace('T', ' ')
        };

        const response = await this._fetch('/productstock', {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        // Return the newly created object structure
        return { ...data, id: response ? response.productID : null };
    }

    static async updateStock(id, data) {
        const payload = {
            productid: data.productId,
            qty: data.qty,
            restock: data.threshold
        };

        await this._fetch(`/productstock/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(payload)
        });

        return this.getStockById(id);
    }

    static async deleteStock(id) {
        const data = await this._fetch(`/productstock/${id}`, { method: 'DELETE' });
        return !!data;
    }



    static async getAllOrders() {
        const ordersData = await this._fetch('/stockorder');
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
                status: status,
                date: o.OrderedAt,
                receivedDate: o.ReceivedAt,
                supplier: o.SupplierName,
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
            suppliername: "External Supplier",
            ordered: new Date().toISOString().slice(0, 10)
        };

        const res = await this._fetch('/stockorder', {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return res;
    }

    static async updateOrderStatus(id, status) {
        if (status.toLowerCase() === 'received') {
            await this._fetch(`/stockorder/received/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    received: new Date().toISOString().slice(0, 10)
                })
            });
        }
        return this.getOrderById(id);
    }

    static async deleteOrder(id) {
        const res = await this._fetch(`/stockorder/${id}`, { method: 'DELETE' });
        return !!res;
    }

    static async getAllEquipment() {
        console.warn("API: No equipment endpoints available.");
        return [];
    }

    static async getEquipmentById(id) {
        return null;
    }

    static async getEquipmentByPartialName(partialName) {
        return [];
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