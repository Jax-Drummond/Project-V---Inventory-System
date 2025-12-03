// Order Routes Integration Tests

import { expect, jest } from "@jest/globals";
import request from "supertest";
import app from "../../app.js";
import InventoryService from "../../src/services/inventoryService.js";

describe("Order Routes", () => {
    beforeEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });

    // GET /api/orders tests
    describe("GET /api/orders", () => {
        it("should return all orders with status 200", async () => {
            const mockOrders = [
                {
                    id: 1,
                    qty: 2,
                    cost: 50,
                    status: "pending",
                    date: "2024-01-01",
                    receivedDate: null,
                    stockId: 1,
                    productId: 1,
                    Product: { id: 1, name: "Product A", price: 25 },
                },
                {
                    id: 2,
                    qty: 1,
                    cost: 30,
                    status: "completed",
                    date: "2024-01-02",
                    receivedDate: "2024-01-05",
                    stockId: 2,
                    productId: 2,
                    Product: { id: 2, name: "Product B", price: 30 },
                },
            ];

            jest.spyOn(InventoryService, "getAllOrders").mockResolvedValue(mockOrders)
            

            const res = await request(app).get("/api/orders");

            expect(InventoryService.getAllOrders).toHaveBeenCalledTimes(1);
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockOrders);
        });

        it("should handle errors and return status 500", async () => {
            const error = new Error("Database error");

            jest.spyOn(InventoryService, "getAllOrders").mockRejectedValue(error);

            const res = await request(app).get("/api/orders");

            expect(InventoryService.getAllOrders).toHaveBeenCalledTimes(1);
            expect(res.statusCode).toBe(500);
            expect(res.body).toEqual({ error: error.message });
        });
    });

    // GET /api/orders/:id tests
    describe("GET /api/orders/:id", () => {
        it("should return the order with the given ID and status 200", async () => {
            const mockOrder = {
                id: 1,
                qty: 2,
                cost: 50,
                status: "pending",
                date: "2024-01-01",
                receivedDate: null,
                stockId: 1,
                productId: 1,
                Product: { id: 1, name: "Product A", price: 25 },
            };

            jest.spyOn(InventoryService, "getOrderById").mockResolvedValue(mockOrder);

            const res = await request(app).get("/api/orders/1");

            expect(InventoryService.getOrderById).toHaveBeenCalledWith("1");
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockOrder);
        });

        it("should return status 404 if order not found", async () => {
            jest.spyOn(InventoryService, "getOrderById").mockResolvedValue(null);
            
            const res = await request(app).get("/api/orders/999");

            expect(InventoryService.getOrderById).toHaveBeenCalledWith("999");
            expect(res.statusCode).toBe(404);
            expect(res.body).toEqual({ message: "Order not found." });
        });
        it("should handle errors and return status 500", async () => {
            const error = new Error("Database error");
            
            jest.spyOn(InventoryService, "getOrderById").mockRejectedValue(error);

            const res = await request(app).get("/api/orders/1");

            expect(InventoryService.getOrderById).toHaveBeenCalledWith("1");
            expect(res.statusCode).toBe(500);
            expect(res.body).toEqual({ error: error.message });
        });
    });
    // POST /api/orders tests
    describe("POST /api/orders", () => {
        it("should create a new order and return it with status 201", async () => {
            const requestBody = {
                qty: 2,
                cost: 50,
                status: "pending",
                stockId: 1
            };
            const mockStock = {
                id: 1,
                qty: 10,
                threshold: 5,
                price: 25,
                productId: 1,
            }

            const mockCreatedOrder = {
                id: 1,
                qty: 2,
                cost: 50,
                status: "pending",
                date: "2024-01-01",
                receivedDate: null,
                stockId: 1,
                productId: 1,
            };

            jest.spyOn(InventoryService, "getStockById").mockResolvedValue(mockStock);
            jest.spyOn(InventoryService, "createOrder").mockResolvedValue(mockCreatedOrder);

            const res = await request(app).post("/api/orders").send(requestBody);

            expect(InventoryService.getStockById).toHaveBeenCalledWith(1);
            expect(InventoryService.createOrder).toHaveBeenCalledWith({
                qty: 2,
                cost: 50,
                status: "pending",
                stockId: 1,
            });
            expect(res.statusCode).toBe(201);
            // Controller returns newOrder directly
            expect(res.body).toEqual(mockCreatedOrder);
        });
        it("should return 404 if stock not found", async () => {
    const requestBody = {
      qty: 2,
      cost: 50,
      status: "pending",
      stockId: 999,
    };

    jest
      .spyOn(InventoryService, "getStockById")
      .mockResolvedValue(null); // no stock

    const res = await request(app)
      .post("/api/orders")
      .send(requestBody);

    expect(InventoryService.getStockById).toHaveBeenCalledWith(999);
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ message: "Stock not found" });
  });

  it("should handle errors and return status 500", async () => {
    const requestBody = {
      qty: 2,
      cost: 50,
      status: "pending",
      stockId: 1,
    };

    const mockStock = {
      id: 1,
      qty: 10,
      threshold: 5,
      price: 25,
      productId: 1,
    };

    const error = new Error("Database error");

    jest
      .spyOn(InventoryService, "getStockById")
      .mockResolvedValue(mockStock); // stock exists

    jest
      .spyOn(InventoryService, "createOrder")
      .mockRejectedValue(error);     // creation fails

    const res = await request(app)
      .post("/api/orders")
      .send(requestBody);

    expect(InventoryService.getStockById).toHaveBeenCalledWith(1);
    expect(InventoryService.createOrder).toHaveBeenCalledWith({
      qty: 2,
      cost: 50,
      status: "pending",
      stockId: 1,
    });
    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: error.message });
  });
});
    // PUT /api/orders/:id tests
    describe("PUT /api/orders/:id", () => {
        it("should update the order status and return with status 200", async () => {
            const requestBody = {
                status: "completed",
            };

            const mockUpdatedOrder = {
                id: 1,
                qty: 2,
                cost: 50,
                status: "completed",
                date: "2024-01-01",
                receivedDate: "2024-01-05",
                stockId: 1,
                productId: 1,
            };

            jest.spyOn(InventoryService, "updateOrderStatus").mockResolvedValue(mockUpdatedOrder);

            const res = await request(app).put("/api/orders/1").send(requestBody);

            expect(InventoryService.updateOrderStatus).toHaveBeenCalledWith("1", requestBody.status);
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({message: "Order status updated successfully.", order: mockUpdatedOrder});
        });
        it("should return status 404 if order to update not found", async () => {
            const requestBody = {
                status: "completed",
            };

            jest.spyOn(InventoryService, "updateOrderStatus").mockResolvedValue(null);

            const res = await request(app).put("/api/orders/999").send(requestBody);

            expect(InventoryService.updateOrderStatus).toHaveBeenCalledWith("999", requestBody.status);
            expect(res.statusCode).toBe(404);
            expect(res.body).toEqual({ message: "Order not found." });
        });
        it("should handle errors and return status 500", async () => {
            const requestBody = {
                status: "completed",
            };
            const error = new Error("Database error");

            jest.spyOn(InventoryService, "updateOrderStatus").mockRejectedValue(error);

            const res = await request(app).put("/api/orders/1").send(requestBody);

            expect(InventoryService.updateOrderStatus).toHaveBeenCalledWith("1", requestBody.status);
            expect(res.statusCode).toBe(500);
            expect(res.body).toEqual({ error: error.message });
        });
    });
    // DELETE /api/orders/:id tests
    describe("DELETE /api/orders/:id", () => {
        it("should delete the order and return status 200", async () => {
            jest.spyOn(InventoryService, "deleteOrder").mockResolvedValue(true);

            const res = await request(app).delete("/api/orders/1");

            expect(InventoryService.deleteOrder).toHaveBeenCalledWith("1");
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ message: "Order deleted successfully."});
        });

        it("should return status 404 if order to delete not found", async () => {
            jest.spyOn(InventoryService, "deleteOrder").mockResolvedValue(false);

            const res = await request(app).delete("/api/orders/999");

            expect(InventoryService.deleteOrder).toHaveBeenCalledWith("999");
            expect(res.statusCode).toBe(404);
            expect(res.body).toEqual({ message: "Order not found." });
        });

        it("should handle errors and return status 500", async () => {
            const error = new Error("Database error");

            jest.spyOn(InventoryService, "deleteOrder").mockRejectedValue(error);

            const res = await request(app).delete("/api/orders/1");

            expect(InventoryService.deleteOrder).toHaveBeenCalledWith("1");
            expect(res.statusCode).toBe(500);
            expect(res.body).toEqual({ error: error.message });
        });
    });
});