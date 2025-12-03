//Product Controller Tests

import { jest } from "@jest/globals";
import ProductController from "../../src/controllers/productController.js";
import InventoryService from "../../src/services/inventoryService.js";

// Mock response helper
function createMockResponse() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("ProductController", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  // getAllProducts tests
  describe("getAllProducts", () => {
    it("should return all products with status 200", async () => {
      const mockProducts = [
        {
          id: 1,
          name: "Ghost Vacuum",
          description: "This is a vacuum",
          price: 315.69,
        },
        {
          id: 2,
          name: "Goo Spray",
          description: "This is a spray",
          price: 23.69,
        },
      ];

      jest
        .spyOn(InventoryService, "getAllProducts")
        .mockResolvedValue(mockProducts);

      const req = {};
      const res = createMockResponse();

      await ProductController.getAllProducts(req, res);

      expect(InventoryService.getAllProducts).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProducts);
    });

    it("should handle errors and return status 500", async () => {
      const error = new Error("Database error");
      jest
        .spyOn(InventoryService, "getAllProducts")
        .mockRejectedValue(error);

      const req = {};
      const res = createMockResponse();

      await ProductController.getAllProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      // Controller uses e.message, not a hardcoded string
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });

  // getProductByID tests (note: method name is getProductByID in controller)
  describe("getProductByID", () => {
    it("should return product by ID with status 200", async () => {
      const mockProduct = {
        id: 1,
        name: "Widget",
        description: "This is a widget",
        price: 425.69,
      };

      jest
        .spyOn(InventoryService, "getProductById")
        .mockResolvedValue(mockProduct);

      const req = { params: { id: "1" } };
      const res = createMockResponse();

      await ProductController.getProductByID(req, res);

      expect(InventoryService.getProductById).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProduct);
    });

    it("should return 404 if product not found", async () => {
      jest.spyOn(InventoryService, "getProductById").mockResolvedValue(null);

      const req = { params: { id: "999" } };
      const res = createMockResponse();

      await ProductController.getProductByID(req, res);

      expect(InventoryService.getProductById).toHaveBeenCalledWith("999");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Product not found." });
    });

    it("should handle errors and return status 500", async () => {
      const error = new Error("Database error");
      jest
        .spyOn(InventoryService, "getProductById")
        .mockRejectedValue(error);

      const req = { params: { id: "1" } };
      const res = createMockResponse();

      await ProductController.getProductByID(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });

  // getProductByPartialName tests
  describe("getProductByPartialName", () => {
    it("should return 400 if name is missing", async () => {
      const req = { query: {} };
      const res = createMockResponse();

      await ProductController.getProductByPartialName(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Name query is required",
      });
    });

    it("should return products matching partial name with status 200", async () => {
      const mockProducts = [
        {
          id: 1,
          name: "Makers Wand",
          description: "The masters wand",
          price: 3215.69,
        },
      ];

      // Service function name in your code is getProductsByName
      jest
        .spyOn(InventoryService, "getProductsByName")
        .mockResolvedValue(mockProducts);

      const req = { query: { name: "Make" } };
      const res = createMockResponse();

      await ProductController.getProductByPartialName(req, res);

      expect(InventoryService.getProductsByName).toHaveBeenCalledWith("Make");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProducts);
    });

    it("should handle errors and return status 500", async () => {
      const error = new Error("Database error");
      jest
        .spyOn(InventoryService, "getProductsByName")
        .mockRejectedValue(error);

      const req = { query: { name: "Make" } };
      const res = createMockResponse();

      await ProductController.getProductByPartialName(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });
});