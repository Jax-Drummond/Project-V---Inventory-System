//Stock Controller Tests

import { describe, expect, jest } from "@jest/globals";
import StockController from "../src/controllers/stockController.js";
import InventoryService from "../src/services/inventoryService.js";

// Mock response helper
function createMockResponse() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("StockController", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });
    
    // getAllStock tests
    describe("getAllStock", () => {
        it("should return all stock with status 200", async () => {
            const mockStock = [
                {
                    id: 1,
                    qty: 100,
                    threshold: 10,
                    price: 500,
                    productId: 1
                },
                {
                    id: 2,
                    qty: 50,
                    threshold: 5,
                    price: 300,
                    productId: 2
                }
            ];

            jest
                .spyOn(InventoryService, "getAllStock")
                .mockResolvedValue(mockStock);
            
            const req = {};
            const res = createMockResponse();

            await StockController.getAllStock(req, res);

            expect(InventoryService.getAllStock).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockStock);
        });

        it("should handle errors and return status 500", async () => {
            const error = new Error("Database error");
            jest
                .spyOn(InventoryService, "getAllStock")
                .mockRejectedValue(error);

            const req = {};
            const res = createMockResponse();

            await StockController.getAllStock(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: error.message });
        });
    });

    // Get stock by ID tests
    describe("getStockByID", () => {
        it("should return stock item by ID with status 200", async () => {
            const mockStockItem = {
                id: 1,
                qty: 100,
                threshold: 10,
                price: 500,
                productId: 1
            };
            
            jest
                .spyOn(InventoryService, "getStockById")
                .mockResolvedValue(mockStockItem);

            const req = { params: { id: "1" } };
            const res = createMockResponse();

            await StockController.getStockByID(req, res);

            expect(InventoryService.getStockById).toHaveBeenCalledWith("1");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockStockItem);
        });

        it("should return 404 if stock item not found", async () => {
            jest
                .spyOn(InventoryService, "getStockById")
                .mockResolvedValue(null);

            const req = { params: { id: "999" } };
            const res = createMockResponse();

            await StockController.getStockByID(req, res);

            expect(InventoryService.getStockById).toHaveBeenCalledWith("999");
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "Item not found." });
        });

        it("should handle errors and return status 500", async () => {
            const error = new Error("Database error");
            jest
                .spyOn(InventoryService, "getStockById")
                .mockRejectedValue(error);

            const req = { params: { id: "1" } };
            const res = createMockResponse();

            await StockController.getStockByID(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: error.message });
        });
    });

    // getStockByProductID tests
    describe("getStockByProductID", () => {
        it("should return stock item by Product ID with status 200", async () => {
            const mockStockItem = {
                id: 1,
                qty: 100,
                threshold: 10,
                price: 500,
                productId: 1
            };
            
            jest
                .spyOn(InventoryService, "getStockByProductId")
                .mockResolvedValue(mockStockItem);

            const req = { params: { id: "1" } };
            const res = createMockResponse();

            await StockController.getStockByProductID(req, res);

            expect(InventoryService.getStockByProductId).toHaveBeenCalledWith("1");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockStockItem);
        });

        it("should return 404 if stock item not found", async () => {
            jest
                .spyOn(InventoryService, "getStockByProductId")
                .mockResolvedValue(null);

            const req = { params: { id: "999" } };
            const res = createMockResponse();

            await StockController.getStockByProductID(req, res);

            expect(InventoryService.getStockByProductId).toHaveBeenCalledWith("999");
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "Item not found." });
        });

        it("should handle errors and return status 500", async () => {
            const error = new Error("Database error");
            jest
                .spyOn(InventoryService, "getStockByProductId")
                .mockRejectedValue(error);

            const req = { params: { id: "1" } };
            const res = createMockResponse();

            await StockController.getStockByProductID(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: error.message });
        });
    });

    // createStock tests
    describe("createStock", () => {
        it("should create a new stock item and return status 201", async () => {
            const mockNewStock = {
                id: 1,
                qty: 100,
                threshold: 10,
                price: 500,
                productId: 1
            };

            jest
                .spyOn(InventoryService, "getProductById")
                .mockResolvedValue({ id: 1, name: "Test Product" });

            jest
                .spyOn(InventoryService, "createStock")
                .mockResolvedValue(mockNewStock);

            const req = { body: { qty: 100, threshold: 10, price: 500, productId: 1 } };
            const res = createMockResponse();

            await StockController.createStock(req, res);

            expect(InventoryService.getProductById).toHaveBeenCalledWith(1);
            expect(InventoryService.createStock).toHaveBeenCalledWith({ qty: 100, threshold: 10, price: 500, productId: 1 });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: "Stock Created",
                stock: mockNewStock
            });
        });

        it("should return 400 if required fields are missing", async () => {
            jest
                .spyOn(InventoryService, "createStock")
                .mockResolvedValue({ id: 1, name: "Test Product" });
            
            const req = { body: { threshold: 10, price: 500 } };
            const res = createMockResponse();

            await StockController.createStock(req, res);

            expect(InventoryService.createStock).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "Missing Fields" });
        });

        it("should return 404 if product not found", async () => {
            jest
                .spyOn(InventoryService, "getProductById")
                .mockResolvedValue(null);

            const req = { body: { qty: 100, threshold: 10, price: 500, productId: 999 } };
            const res = createMockResponse();
            
            await StockController.createStock(req, res);

            expect(InventoryService.getProductById).toHaveBeenCalledWith(999);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "Product not found." });
        });

        it("should handle errors and return status 500", async () => {
            const error = new Error("Database error");
            jest
                .spyOn(InventoryService, "getProductById")
                .mockResolvedValue({ id: 1, name: "Test Product" });

            jest
                .spyOn(InventoryService, "createStock")
                .mockRejectedValue(error);

            const req = { body: { qty: 100, threshold: 10, price: 500, productId: 1 } };
            const res = createMockResponse();

            await StockController.createStock(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: error.message });
        });
    });

    //updateStock tests
    describe("updateStock", () => {
        it("should update stock item and return status 200", async () => {
            const mockUpdatedStock = {
                id: 1,
                qty: 150,
                threshold: 15,
                price: 550,
                productId: 1
            };

            jest
                .spyOn(InventoryService, "updateStock")
                .mockResolvedValue(mockUpdatedStock);

            const req = { params: { id: "1" }, body: { qty: 150, threshold: 15, price: 550 } };
            const res = createMockResponse();

            await StockController.updateStock(req, res);

            expect(InventoryService.updateStock).toHaveBeenCalledWith("1", { qty: 150, threshold: 15, price: 550 });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Stock updated",
                stock: mockUpdatedStock
            });
        });

        it("should return 404 if stock item not found", async () => {
            jest
                .spyOn(InventoryService, "updateStock")
                .mockResolvedValue(null);

            const req = { params: { id: "999" }, body: { qty: 150, threshold: 15, price: 550 } };
            const res = createMockResponse();

            await StockController.updateStock(req, res);

            expect(InventoryService.updateStock).toHaveBeenCalledWith("999", { qty: 150, threshold: 15, price: 550 });
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "Stock not found." });
        });

        it("should handle errors and return status 500", async () => {
            const error = new Error("Database error");
            jest
                .spyOn(InventoryService, "updateStock")
                .mockRejectedValue(error);

            const req = { params: { id: "1" }, body: { qty: 150, threshold: 15, price: 550 } };
            const res = createMockResponse();

            await StockController.updateStock(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: error.message });
        });
    });

    // deleteStock tests
    describe("deleteStock", () => {
        it("should delete stock item and return status 200", async () => {
            const mockDeletedStock = {
                id: 1,
                qty: 100,
                threshold: 10,
                price: 500,
                productId: 1
            };

            jest
                .spyOn(InventoryService, "deleteStock")
                .mockResolvedValue(true);

            const req = { params: { id: "1" } };
            const res = createMockResponse();

            await StockController.deleteStock(req, res);

            expect(InventoryService.deleteStock).toHaveBeenCalledWith("1");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: "Stock deleted" });
        });

        it("should return 404 if stock item not found", async () => {
            jest
                .spyOn(InventoryService, "deleteStock")
                .mockResolvedValue(false);

            const req = { params: { id: "999" } };
            const res = createMockResponse();

            await StockController.deleteStock(req, res);

            expect(InventoryService.deleteStock).toHaveBeenCalledWith("999");
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "Stock not found" });
        });

        it("should handle errors and return status 500", async () => {
            const error = new Error("Database error");
            jest
                .spyOn(InventoryService, "deleteStock")
                .mockRejectedValue(error);

            const req = { params: { id: "1" } };
            const res = createMockResponse();

            await StockController.deleteStock(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: error.message });
        });
    });
});