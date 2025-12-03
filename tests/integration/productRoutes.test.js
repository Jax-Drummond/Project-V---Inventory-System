// product Routes Tests

import { jest } from "@jest/globals";
import request from "supertest";
import app from "../../app.js";
import InventoryService from "../../src/services/inventoryService.js";

describe("Product Routes", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

    // GET /api/products tests
    describe("GET /api/products", () => {
    it("should return all products with status 200", async () => {
      const mockProducts = [
        {
            ProductID: 1,
            ProductName: "Product A",
            ProductDescription: "Description A",
            Price: 100.00,
            CreatedAt: "2024-01-01T00:00:00.000Z",
        },
        {
            ProductID: 2,
            ProductName: "Product B",
            ProductDescription: "Description B",
            Price: 150.00,
            CreatedAt: "2024-01-02T00:00:00.000Z",
        }
        ];
        jest
            .spyOn(InventoryService, "getAllProducts")
            .mockResolvedValue(mockProducts);

        const res = await request(app).get("/api/products");

        expect(InventoryService.getAllProducts).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockProducts);
    });

    it("should handle errors and return status 500", async () => {
      const error = new Error("Database error");
        jest
            .spyOn(InventoryService, "getAllProducts")
            .mockRejectedValue(error);

        const res = await request(app).get("/api/products");

        expect(InventoryService.getAllProducts).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ error: error.message });
    });

    // GET /api/products/:id tests
    describe("GET /api/products/:id", () => {
    it("should return product by ID with status 200", async () => {
        const mockProduct = {
            ProductID: 1,
            ProductName: "Product A",
            ProductDescription: "Description A",
            Price: 100.00,
            CreatedAt: "2024-01-01T00:00:00.000Z",
        };
        jest
            .spyOn(InventoryService, "getProductById")
            .mockResolvedValue(mockProduct);

        const res = await request(app).get("/api/products/1");

        expect(InventoryService.getProductById).toHaveBeenCalledWith("1");
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockProduct);
    });

    it("should return 404 if product not found", async () => {
      jest.spyOn(InventoryService, "getProductById").mockResolvedValue(null);
        const res = await request(app).get("/api/products/999");

        expect(InventoryService.getProductById).toHaveBeenCalledWith("999");
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: "Product not found." });
    });

    it("should handle errors and return status 500", async () => {
      const error = new Error("Database error");
        jest
            .spyOn(InventoryService, "getProductById")
            .mockRejectedValue(error);

        const res = await request(app).get("/api/products/1");

        expect(InventoryService.getProductById).toHaveBeenCalledWith("1");
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ error: error.message });
    });
    // GET /api/products/search?name=... tests
    describe("GET /api/products/search/:name", () => {
    it("should return products matching name with status 200", async () => {
        const mockProducts = [
        {
            ProductID: 1,
            ProductName: "Product A",
            ProductDescription: "Description A",
            Price: 100.00,
            CreatedAt: "2024-01-01T00:00:00.000Z",
        },
        ];
        jest
            .spyOn(InventoryService, "getProductsByName")
            .mockResolvedValue(mockProducts);
        
            const res = await request(app)
                .get("/api/products/search/")
                .query({ name: "Product A" });

        expect(InventoryService.getProductsByName).toHaveBeenCalledWith("Product A");
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockProducts);
    });

    it("should return 404 if no products found", async () => {
      jest.spyOn(InventoryService, "getProductsByName").mockResolvedValue([]);
        
      const res = await request(app).get("/api/products/search/").query({ name: "NonExistentProduct" }); 

        expect(InventoryService.getProductsByName).toHaveBeenCalledWith("NonExistentProduct");
        expect(res.status).toBe(404);
        expect(res.body).toEqual({message: "Product not found."});
    });

    it("should handle errors and return status 500", async () => {
      const error = new Error("Database error");
        jest
            .spyOn(InventoryService, "getProductsByName")
            .mockRejectedValue(error);

        const res = await request(app).get("/api/products/search/").query({ name: "Product A" });

        expect(InventoryService.getProductsByName).toHaveBeenCalledWith("Product A");
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ error: error.message });
    });
    });
});
}); 
});