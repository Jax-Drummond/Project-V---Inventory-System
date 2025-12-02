// Order Controller Tests

import { jest } from "@jest/globals";
import OrderController from "../src/controllers/orderController.js";
import InventoryService from "../src/services/inventoryService.js";

// Mock response helper
function createMockResponse() {
  const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("OrderController", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

    // getAllOrders tests
    describe("getAllOrders", () => {
    it("should return all orders with status 200", async () => {
      const mockOrders = [
        {
            id: 1,
            qty: 5,
            date: "2024-01-01",
            cost: 150.00,
            status: "Pending",
            stockId: 2
        },
        {
            id: 2,
            qty: 3,
            date: "2024-01-02",
            cost: 90.00,
            status: "Shipped",
            stockId: 1
        },
      ];
        jest
            .spyOn(InventoryService, "getAllOrders")
            .mockResolvedValue(mockOrders);

        const req = {};
        const res = createMockResponse();

        await OrderController.getAllOrders(req, res);

        expect(InventoryService.getAllOrders).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockOrders);
    });
    
    it("should handle errors and return status 500", async () => {
      const error = new Error("Database error");
        jest
            .spyOn(InventoryService, "getAllOrders")
            .mockRejectedValue(error);

        const req = {};
        const res = createMockResponse();

        await OrderController.getAllOrders(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
    
    });
    // getOrderByID tests
    describe("getOrderByID", () => {
    it("should return order by ID with status 200", async () => {
      const mockOrder = {
            id: 1,
            qty: 5,
            date: "2024-01-01",
            cost: 150.00,
            status: "Pending",
            stockId: 2
        };
        jest
            .spyOn(InventoryService, "getOrderById")
            .mockResolvedValue(mockOrder);

        const req = { params: { id: "1" } };
        const res = createMockResponse();

        await OrderController.getOrderByID(req, res);

        expect(InventoryService.getOrderById).toHaveBeenCalledWith("1");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockOrder);
    });

    it("should return 404 if order not found", async () => {
        jest
            .spyOn(InventoryService, "getOrderById")
            .mockResolvedValue(null);

        const req = { params: { id: "999" } };
        const res = createMockResponse();

        await OrderController.getOrderByID(req, res);

        expect(InventoryService.getOrderById).toHaveBeenCalledWith("999");
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Order not found." });
    });

    it("should handle errors and return status 500", async () => {
      const error = new Error("Database error");
        jest
            .spyOn(InventoryService, "getOrderById")
            .mockRejectedValue(error);
        
        const req = { params: { id: "1" } };
        const res = createMockResponse();

        await OrderController.getOrderByID(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
    });
    // createOrder tests
    describe("createOrder", () => {
    it("should create a new order and return it with status 201", async () => {
      const mockStock = { id: 2, name: "Test Stock" };
      const mockNewOrder = {
            id: 1,
            qty: 5,
            date: "2024-01-01",
            cost: 150.00,
            status: "Pending",
            stockId: 2
        };

        jest
            .spyOn(InventoryService, "getStockById")
            .mockResolvedValue(mockStock);
        jest
            .spyOn(InventoryService, "createOrder")
            .mockResolvedValue(mockNewOrder);

        const req = { body: { qty: 5, cost: 150.00, status: "Pending", stockId: 2 } };
        const res = createMockResponse();

        await OrderController.createOrder(req, res);

        expect(InventoryService.getStockById).toHaveBeenCalledWith(2);
        expect(InventoryService.createOrder).toHaveBeenCalledWith({ qty: 5, cost: 150.00, status: "Pending", stockId: 2 });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(mockNewOrder);
    });

    it("should return 404 if stock not found", async () => {
        jest
            .spyOn(InventoryService, "getStockById")
            .mockResolvedValue(null);

        const req = { body: { qty: 5, cost: 150.00, status: "Pending", stockId: 999 } };
        const res = createMockResponse();

        await OrderController.createOrder(req, res);

        expect(InventoryService.getStockById).toHaveBeenCalledWith(999);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Stock not found" });
    });

    it("should handle errors and return status 500", async () => {
      const error = new Error("Database error");
        jest
            .spyOn(InventoryService, "getStockById")
            .mockRejectedValue(error);

        const req = { body: { qty: 5, cost: 150.00, status: "Pending", stockId: 2 } };
        const res = createMockResponse();

        await OrderController.createOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
    });
    // updateOrderStatus tests
    describe("updateOrderStatus", () => {
    it("should update order status and return updated order with status 200", async () => {
      const mockUpdatedOrder = {
            id: 1,
            qty: 5,
            date: "2024-01-01",
            cost: 150.00,
            status: "Shipped",
            stockId: 2
        };
        jest
            .spyOn(InventoryService, "updateOrderStatus")
            .mockResolvedValue(mockUpdatedOrder);

        const req = { params: { id: "1" }, body: { status: "Shipped" } };
        const res = createMockResponse();

        await OrderController.updateOrderStatus(req, res);

        expect(InventoryService.updateOrderStatus).toHaveBeenCalledWith("1", "Shipped");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Order status updated successfully.",
            order: mockUpdatedOrder
        });
    });

    it("should return 400 if new status is missing", async () => {
        const req = { params: { id: "1" }, body: {} };
        const res = createMockResponse();
        await OrderController.updateOrderStatus(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Missing new status." });
    });

    it("should return 404 if order not found", async () => {
        jest
            .spyOn(InventoryService, "updateOrderStatus")
            .mockResolvedValue(null);

        const req = { params: { id: "999" }, body: { status: "Shipped" } };
        const res = createMockResponse();

        await OrderController.updateOrderStatus(req, res);

        expect(InventoryService.updateOrderStatus).toHaveBeenCalledWith("999", "Shipped");
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Order not found." });
    });

    it("should handle errors and return status 500", async () => {
      const error = new Error("Database error");
        jest
            .spyOn(InventoryService, "updateOrderStatus")
            .mockRejectedValue(error);

        const req = { params: { id: "1" }, body: { status: "Shipped" } };
        const res = createMockResponse();

        await OrderController.updateOrderStatus(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
    });
});