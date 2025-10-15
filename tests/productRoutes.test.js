import request from "supertest"
import {jest} from "@jest/globals"

let Product
let app

// Mock Model
beforeAll(async () => {
  await jest.unstable_mockModule("../src/models/productModel.js", () => {
    return {
      default: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
      },
    };
  });

  const mod = await import("../src/models/productModel.js")
  Product = mod.default

  const appModule = await import("../app.js")
  app = appModule.default
});

describe("Product API Routes", () => {
  afterEach(() => {
    jest.clearAllMocks(); // reset mocks after each test
  });

  test("GET /api/products should return all products", async () => {
    const mockProducts = [
      { id: 1, name: "Ghost Vacuum", description: "This is a vacuum", price: 315.69 },
      { id: 2, name: "Goo Spray", description: "This is a spray", price: 23.69},
    ];
    Product.findAll.mockResolvedValue(mockProducts);

    const res = await request(app).get("/api/products");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockProducts);
    expect(Product.findAll).toHaveBeenCalledTimes(1);
  });

  test("GET /api/products/search?name=Make should return matching products", async () => {
    const mockProducts = [{ id: 1, name: "Makers Wand", description: "The masters wand", price: 3215.69 }];
    Product.findAll.mockResolvedValue(mockProducts);

    const res = await request(app).get("/api/products/search?name=Make");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockProducts);
    expect(Product.findAll).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.any(Object),
      })
    );
  });

  test("GET /api/products/:id should return a product by ID", async () => {
    const mockProduct = { id: 2, name: "Widget", description: "This is a widget", price: 425.69 };
    Product.findByPk.mockResolvedValue(mockProduct);

    const res = await request(app).get("/api/products/1");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockProduct);
    expect(Product.findByPk).toHaveBeenCalledWith("1");
  });

  test("GET /api/products/:id returns 404 if not found", async () => {
    Product.findByPk.mockResolvedValue(null);

    const res = await request(app).get("/api/products/999");

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ message: "Product not found." });
  });
});