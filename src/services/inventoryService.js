import { products, stocks, equipment, orders } from "../data/data.js";


// This only works for the mock data
// Will need to be changed to work with external api

class InventoryService {

    static _getProduct(id) {
        return products.find(p => p.id === parseInt(id));
    }

    static _getStock(id) {
        return stocks.find(s => s.id === parseInt(id));
    }

    static async getAllProducts() {
        return products;
    }

    static async getProductById(id) {
        return this._getProduct(id);
    }

    static async getProductsByName(partialName) {
        const lowerName = partialName.toLowerCase();
        return products.filter(p => p.name.toLowerCase().includes(lowerName));
    }


    static async getAllStock() {
        return stocks.map(stock => ({
            ...stock,
            Product: this._getProduct(stock.productId)
        }));
    }

    static async getStockById(id) {
        const stock = this._getStock(id);
        if (!stock) return null;
        return {
            ...stock,
            Product: this._getProduct(stock.productId)
        };
    }

    static async createStock(data) {
        const newStock = {
            id: stocks.length + 1,
            qty: data.qty,
            threshold: data.threshold || 0,
            price: data.price || 0,
            productId: data.productId
        };
        stocks.push(newStock);
        return newStock;
    }

    static async updateStock(id, data) {
        const stock = this._getStock(id);
        if (!stock) return null;

        if (data.qty !== undefined) stock.qty = data.qty;
        if (data.threshold !== undefined) stock.threshold = data.threshold;
        if (data.price !== undefined) stock.price = data.price;

        return stock;
    }

    static async deleteStock(id) {
        const index = stocks.findIndex(s => s.id === parseInt(id));
        if (index === -1) return false;
        stocks.splice(index, 1);
        return true;
    }


    static async getAllOrders() {
        return orders.map(order => {
            const stock = this._getStock(order.stockId);
            const product = stock ? this._getProduct(stock.productId) : null;
            return {
                ...order,
                Stock: stock,
                Product: product
            };
        });
    }

    static async getOrderById(id) {
        const order = orders.find(o => o.id === parseInt(id));
        if (!order) return null;

        const stock = this._getStock(order.stockId);
        const product = stock ? this._getProduct(stock.productId) : null;

        return {
            ...order,
            Stock: stock,
            Product: product
        };
    }

    static async createOrder(data) {
        const newOrder = {
            id: orders.length + 1,
            qty: data.qty,
            cost: data.cost,
            status: data.status,
            date: new Date(),
            stockId: data.stockId
        };
        orders.push(newOrder);
        return newOrder;
    }

    static async updateOrderStatus(id, status) {
        const order = orders.find(o => o.id === parseInt(id));
        if (!order) return null;
        order.status = status;
        return order;
    }

    static async deleteOrder(id) {
        const index = orders.findIndex(o => o.id === parseInt(id));
        if (index === -1) return false;
        orders.splice(index, 1);
        return true;
    }

    // --- EQUIPMENT SERVICES ---

    static async getAllEquipment() {
        return equipment.map(eq => ({
            ...eq,
            Product: this._getProduct(eq.productId)
        }));
    }

    static async getEquipmentById(id) {
        const eq = equipment.find(e => e.id === parseInt(id));
        if (!eq) return null;
        return {
            ...eq,
            Product: this._getProduct(eq.productId)
        };
    }

    static async getEquipmentByPartialName(partialName) {

        const lowerName = partialName.toLowerCase();

        const joinedEquipment = equipment.map(eq => ({
            ...eq,
            Product: this._getProduct(eq.productId)
        }));

        return joinedEquipment.filter(eq =>
            eq.Product && eq.Product.name.toLowerCase().includes(lowerName)
        );
    }
}

export default InventoryService;