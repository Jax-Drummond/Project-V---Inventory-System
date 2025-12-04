// Equipment Routes Tests

import { jest } from "@jest/globals";
import request from "supertest";
import app from "../../app.js";
import InventoryService from "../../src/services/inventoryService.js";

describe("Equipment Routes", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  // GET /api/equipment
  describe("GET /api/equipment", () => {
    it("should return all equipment with status 200", async () => {
      const mockEquipment = [
        { id: 1, name: "Hammer of Doom", status: "Available", type: "Tool" },
        { id: 2, name: "Ghost Vacuum", status: "In Use", type: "Vehicle" },
      ];

      jest
        .spyOn(InventoryService, "getAllEquipment")
        .mockResolvedValue(mockEquipment);

      const res = await request(app).get("/api/equipment");

      expect(InventoryService.getAllEquipment).toHaveBeenCalledTimes(1);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockEquipment);
    });

    it("should handle errors and return status 500", async () => {
      const error = new Error("Database error");

      jest
        .spyOn(InventoryService, "getAllEquipment")
        .mockRejectedValue(error);

      const res = await request(app).get("/api/equipment");

      expect(InventoryService.getAllEquipment).toHaveBeenCalledTimes(1);
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: error.message });
    });
  });

  // GET /api/equipment/:id
  describe("GET /api/equipment/:id", () => {
    it("should return equipment by ID with status 200", async () => {
      const mockEquipment = {
        id: 1,
        name: "Hammer of Doom",
        status: "Available",
        type: "Tool",
      };

      jest
        .spyOn(InventoryService, "getEquipmentById")
        .mockResolvedValue(mockEquipment);

      const res = await request(app).get("/api/equipment/1");

      expect(InventoryService.getEquipmentById).toHaveBeenCalledWith("1");
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockEquipment);
    });

    it("should return 404 if equipment not found", async () => {
      jest
        .spyOn(InventoryService, "getEquipmentById")
        .mockResolvedValue(null);

      const res = await request(app).get("/api/equipment/999");

      expect(InventoryService.getEquipmentById).toHaveBeenCalledWith("999");
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: "Equipment not found." });
    });

    it("should handle errors and return status 500", async () => {
      const error = new Error("Database error");

      jest
        .spyOn(InventoryService, "getEquipmentById")
        .mockRejectedValue(error);

      const res = await request(app).get("/api/equipment/1");

      expect(InventoryService.getEquipmentById).toHaveBeenCalledWith("1");
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: error.message });
    });
  });

  // GET /api/equipment/search?name=
  describe("GET /api/equipment/search?name=", () => {
    it("should return equipment matching partial name with status 200", async () => {
      const mockEquipment = [
        { id: 2, name: "Hammer of Doom", status: "In Use", type: "Tool" },
      ];

      jest
        .spyOn(InventoryService, "getEquipmentByPartialName")
        .mockResolvedValue(mockEquipment);

      const res = await request(app).get(
        "/api/equipment/search?name=Hammer"
      );

      expect(InventoryService.getEquipmentByPartialName).toHaveBeenCalledWith(
        "Hammer"
      );
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockEquipment);
    });

    it("should return 404 if no equipment matches", async () => {
      jest
        .spyOn(InventoryService, "getEquipmentByPartialName")
        .mockResolvedValue([]);

      const res = await request(app).get(
        "/api/equipment/search?name=NonExistent"
      );

      expect(InventoryService.getEquipmentByPartialName).toHaveBeenCalledWith(
        "NonExistent"
      );
      expect(res.status).toBe(404);
      expect(res.body).toEqual({message: "Equipment Not Found."});
    });

    it("should handle errors and return status 500", async () => {
      const error = new Error("Database error");

      jest
        .spyOn(InventoryService, "getEquipmentByPartialName")
        .mockRejectedValue(error);

      const res = await request(app).get(
        "/api/equipment/search?name=Hammer"
      );

      expect(InventoryService.getEquipmentByPartialName).toHaveBeenCalledWith(
        "Hammer"
      );
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: error.message });
    });
  });

  // PUT /api/equipment/:id
  describe("PUT /api/equipment/:id", () => {
    it("should update equipment status and return status 200", async () => {
      const requestBody = { status: "In Use" };

      const mockUpdatedEquipment = {
        id: 1,
        name: "Hammer of Doom",
        status: "In Use",
        type: "Tool",
      };

      jest
        .spyOn(InventoryService, "updateEquipmentStatus")
        .mockResolvedValue(mockUpdatedEquipment);

      const res = await request(app)
        .put("/api/equipment/1")
        .send(requestBody);

      expect(InventoryService.updateEquipmentStatus).toHaveBeenCalledWith(
        "1",
        { status: "In Use" }
      );
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        message: "Stock updated",
        equipment: mockUpdatedEquipment,
      });
    });

    it("should return 404 if equipment not found", async () => {
      const requestBody = { status: "In Use" };

      jest
        .spyOn(InventoryService, "updateEquipmentStatus")
        .mockResolvedValue(null);

      const res = await request(app)
        .put("/api/equipment/999")
        .send(requestBody);

      expect(InventoryService.updateEquipmentStatus).toHaveBeenCalledWith(
        "999",
        { status: "In Use" }
      );
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: "Equipment not found." });
    });

    it("should handle errors and return status 500", async () => {
      const requestBody = { status: "In Use" };
      const error = new Error("Database error");

      jest
        .spyOn(InventoryService, "updateEquipmentStatus")
        .mockRejectedValue(error);

      const res = await request(app)
        .put("/api/equipment/1")
        .send(requestBody);

      expect(InventoryService.updateEquipmentStatus).toHaveBeenCalledWith(
        "1",
        { status: "In Use" }
      );
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: error.message });
    });
  });
});