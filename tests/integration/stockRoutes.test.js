// Stock Routes Integration Tests

import { jest } from "@jest/globals";
import request from "supertest";
import app from "../../app.js";
import InventoryService from "../../src/services/inventoryService.js";
import id from "volleyball/lib/id.js";

describe("Stock Routes", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

    // GET /api/stock tests
    describe("GET /api/stock", () => {
    it("should return all stock items with status 200", async () => {
      const mockStockItems = [
        {
            ProductID: 1,
            QuantityAvailablle: 50,
            RestockThreshold: 10, 
            LastRestockDate: "2024-01-01T00:00:00.000Z",
        },
        {
            ProductID: 2,
            QuantityAvailablle: 30,
            RestockThreshold: 5, 
            LastRestockDate: "2024-01-02T00:00:00.000Z",
        }
        ];
        jest
            .spyOn(InventoryService, "getAllStock")
            .mockResolvedValue(mockStockItems);

        const response = await request(app).get("/api/stock");
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockStockItems);
    });

    it("should handle errors and return status 500", async () => {
      const error = new Error("Database error");
        jest
            .spyOn(InventoryService, "getAllStock")
            .mockRejectedValue(error);

        const response = await request(app).get("/api/stock");
        
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: error.message });
    });
    });
    // GET /api/stock/:id tests
    describe("GET /api/stock/:id", () => {
    it("should return stock item by ProductID with status 200", async () => {
        const mockStockItem = {
            ProductID: 1,
            QuantityAvailablle: 50,
            RestockThreshold: 10, 
            LastRestockDate: "2024-01-01T00:00:00.000Z",
        };
        jest
            .spyOn(InventoryService, "getStockById")
            .mockResolvedValue(mockStockItem);

        const response = await request(app).get("/api/stock/1");

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockStockItem);
    });

    it ("should return 404 if stock item not found", async () => {
        jest
            .spyOn(InventoryService, "getStockById")
            .mockResolvedValue(null);

        const response = await request(app).get("/api/stock/999");

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: "Item not found." });
    });

    it("should handle errors and return status 500", async () => {
      const error = new Error("Database error");
        jest
            .spyOn(InventoryService, "getStockById")
            .mockRejectedValue(error);

        const response = await request(app).get("/api/stock/1");

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: error.message });
    });
    });
    // POST /api/stock tests
    describe("POST /api/stock", () => {
    it("should create a new stock item and return status 201", async () => {
        const requestBody = {
            qty: 100,
            threshold: 20,
            price: 15.00,
            productId: 3
        };
        const mockProduct = {
            id: 3,
            name: "Product C",
            description: "Description C",
            price: 15.00,
        };

        const mockStockItem = {
            id: 3,
            ...requestBody
        };

        jest
            .spyOn(InventoryService, "getProductById")
            .mockResolvedValue(mockProduct);
        jest
            .spyOn(InventoryService, "createStock")
            .mockResolvedValue(mockStockItem);

        const response = await request(app)
            .post("/api/stock")
            .send(requestBody);

        expect(InventoryService.getProductById).toHaveBeenCalledWith(3);
        expect(InventoryService.createStock).toHaveBeenCalledWith(requestBody);
        expect(response.status).toBe(201);
        expect(response.body).toEqual(
            { message: "Stock Created", stock: mockStockItem }
        );
    });
    it("should handle errors and return status 500", async () => {
      const error = new Error("Database error");
        
      const mockProduct = {
            id: 3,
            name: "Product C",
            description: "Description C",
            price: 15.00,
        };

        jest
            .spyOn(InventoryService, "getProductById")
            .mockResolvedValue(mockProduct);
        jest
            .spyOn(InventoryService, "createStock")
            .mockRejectedValue(error);

        const response = await request(app)
            .post("/api/stock")
            .send({
                qty: 100,
                threshold: 20,
                price: 15.00,
                productId: 3
            });

        expect(InventoryService.getProductById).toHaveBeenCalledWith(3);
        expect(InventoryService.createStock).toHaveBeenCalled();
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: error.message });
    });
    });
    // PUT /api/stock/:id tests
    describe("PUT /api/stock/:id", () => {
    it("should update stock item and return status 200", async () => {
        const requestBody = {
            qty: 80,
            threshold: 15,
            price: 12.00,
        };
        const mockStockItem = {
            id: 1,
            qty: 80,
            threshold: 15,
            price: 12.00,
            productId: 1
        };

        jest
            .spyOn(InventoryService, "updateStock")
            .mockResolvedValue(mockStockItem);

        const response = await request(app)
            .put("/api/stock/1")
            .send(requestBody);

        expect(InventoryService.updateStock).toHaveBeenCalledWith("1", requestBody);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            { message: "Stock updated", stock: mockStockItem }
        );
    });
    it("should return 404 if stock item to update not found", async () => {
        const requestBody = {
            qty: 80,
            threshold: 15,
            price: 12.00,
        };

        jest
            .spyOn(InventoryService, "updateStock")
            .mockResolvedValue(null);

        const response = await request(app)
            .put("/api/stock/999")
            .send(requestBody);

        expect(InventoryService.updateStock).toHaveBeenCalledWith("999", requestBody);
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: "Stock not found." });
    });

    it("should handle errors and return status 500", async () => {
      const error = new Error("Database error");
        const requestBody = {
            qty: 80,
            threshold: 15,
            price: 12.00,
        };

        jest
            .spyOn(InventoryService, "updateStock")
            .mockRejectedValue(error);

        const response = await request(app)
            .put("/api/stock/1")
            .send(requestBody);

        expect(InventoryService.updateStock).toHaveBeenCalledWith("1", requestBody);
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: error.message });
    });
    });
    // DELETE /api/stock/:id tests
    describe("DELETE /api/stock/:id", () => {
    it("should delete stock item and return status 200", async () => {
        jest
            .spyOn(InventoryService, "deleteStock")
            .mockResolvedValue(true);

        const response = await request(app).delete("/api/stock/1");

        expect(InventoryService.deleteStock).toHaveBeenCalledWith("1");
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: "Stock deleted" });
    });

    it("should return 404 if stock item to delete not found", async () => {
        jest
            .spyOn(InventoryService, "deleteStock")
            .mockResolvedValue(false);

        const response = await request(app).delete("/api/stock/999");

        expect(InventoryService.deleteStock).toHaveBeenCalledWith("999");
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: "Stock not found" });
    });

    it("should handle errors and return status 500", async () => {
      const error = new Error("Database error");
        jest
            .spyOn(InventoryService, "deleteStock")
            .mockRejectedValue(error);
        
        const response = await request(app).delete("/api/stock/1");

        expect(InventoryService.deleteStock).toHaveBeenCalledWith("1");
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: error.message });
    });
    });
});
