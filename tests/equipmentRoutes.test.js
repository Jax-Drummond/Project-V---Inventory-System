// tests/equipmentRoutes.test.js
import request from "supertest";
import { jest } from "@jest/globals";

// Mock models BEFORE importing the app or controller
let Equipment;

beforeAll(async () => {
  // Mock ProductModel minimally to prevent association errors
  await jest.unstable_mockModule("../src/models/productModel.js", () => {
    return { default: {} };
  });

  // Mock EquipmentModel
  await jest.unstable_mockModule("../src/models/equipmentModel.js", () => {
    return {
      default: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
      },
    };
  });

  // Import the mocked models
  const mod = await import("../src/models/equipmentModel.js");
  Equipment = mod.default;
});

// Import app AFTER mocks
let app;
beforeAll(async () => {
  const appModule = await import("../app.js");
  app = appModule.default;
});

describe("Equipment API Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("GET /api/equipment should return all equipment", async () => {
    const mockEquipment = [
      { id: 1, qty: 5, status: "Available", productId: 1 },
      { id: 2, qty: 2, status: "In Use", productId: 1 },
    ];
    Equipment.findAll.mockResolvedValue(mockEquipment);

    const res = await request(app).get("/api/equipment");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockEquipment);
    expect(Equipment.findAll).toHaveBeenCalledTimes(1);
  });

  test("GET /api/equipment/search?name=Ham should return matching equipment", async () => {
    const mockEquipment = [{ id: 2, qty: 2, status: "In Use", productId: 1 }];
    Equipment.findAll.mockResolvedValue(mockEquipment);

    const res = await request(app).get("/api/equipment/search?name=Ham");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockEquipment);
    expect(Equipment.findAll).toHaveBeenCalledWith(
    expect.objectContaining({
    include: expect.any(Array),
  })
);});

  test("GET /api/equipment/:id should return equipment by ID", async () => {
    const mockEquip = { id: 1, qty: 5, status: "Available", productId: 1 };
    Equipment.findByPk.mockResolvedValue(mockEquip);

    const res = await request(app).get("/api/equipment/1");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockEquip);
    expect(Equipment.findByPk).toHaveBeenCalledWith("1",
        expect.objectContaining({
        include: expect.any(Object),
  })
);});

  test("GET /api/equipment/:id returns 404 if not found", async () => {
    Equipment.findByPk.mockResolvedValue(null);

    const res = await request(app).get("/api/equipment/999");

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ message: "Equipment not found." });
  });
});
