//equipment Controller Tests
import { jest } from "@jest/globals";
import EquipmentController from "../../src/controllers/equipmentController.js";
import InventoryService from "../../src/services/inventoryService.js";

// Mock response helper
function createMockResponse() {
  const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("EquipmentController", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });
    
    // getAllEquipment tests
    describe("getAllEquipment", () => {
    it("should return all equipment with status 200", async () => {
        const mockEquipment = [
        {
            id: 1,
            name: "Drill",
            description: "Electric drill",
            status: "Available"
        },
        {
            id: 2,
            name: "Hammer",
            description: "Steel hammer",
            status: "In Use"
        },
        ];
        jest
            .spyOn(InventoryService, "getAllEquipment")
            .mockResolvedValue(mockEquipment);

        const req = {};
        const res = createMockResponse();

        await EquipmentController.getAllEquipment(req, res);

        expect(InventoryService.getAllEquipment).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockEquipment);
    });
    it("should handle errors and return status 500", async () => {
      const error = new Error("Database error");
        jest
            .spyOn(InventoryService, "getAllEquipment")
            .mockRejectedValue(error);

        const req = {};
        const res = createMockResponse();

        await EquipmentController.getAllEquipment(req, res);

        expect(InventoryService.getAllEquipment).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
});
    //getEquipmentByID tests
    describe("getEquipmentByID", () => {
    it("should return equipment by ID with status 200", async () => {
        const mockEquipment = {
        id: 1,
        name: "Drill",
        description: "Electric drill",
        status: "Available"
        };
        jest
            .spyOn(InventoryService, "getEquipmentById")
            .mockResolvedValue(mockEquipment);

        const req = { params: { id: "1" } };
        const res = createMockResponse();

        await EquipmentController.getEquipmentByID(req, res);

        expect(InventoryService.getEquipmentById).toHaveBeenCalledWith("1");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockEquipment);
    });

    it("should return 404 if equipment not found", async () => {
      jest.spyOn(InventoryService, "getEquipmentById").mockResolvedValue(null);

        const req = { params: { id: "999" } };
        const res = createMockResponse();

        await EquipmentController.getEquipmentByID(req, res);

        expect(InventoryService.getEquipmentById).toHaveBeenCalledWith("999");
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Equipment not found." });
    });

    it("should handle errors and return status 500", async () => {
      const error = new Error("Database error");
        jest
            .spyOn(InventoryService, "getEquipmentById")
            .mockRejectedValue(error);

        const req = { params: { id: "1" } };
        const res = createMockResponse();

        await EquipmentController.getEquipmentByID(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
    //getEquipmentByPartialName tests
    describe("getEquipmentByPartialName", () => {
    it("should return equipment by partial name with status 200", async () => {
        const mockEquipment = [
        {
            id: 1,
            name: "Drill",
            description: "Electric drill",
            status: "Available"
        },
        {
            id: 2,
            name: "Hammer Drill",
            description: "Heavy duty hammer drill",
            status: "In Use"
        },
        ];
        jest
            .spyOn(InventoryService, "getEquipmentByPartialName")
            .mockResolvedValue(mockEquipment);

        const req = { query: { name: "Drill" } };
        const res = createMockResponse();

        await EquipmentController.getEquipmentByPartialName(req, res);

        expect(InventoryService.getEquipmentByPartialName).toHaveBeenCalledWith("Drill");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockEquipment);
    });

    it("should return 400 if name is missing", async () => {
      jest.
            spyOn(InventoryService, "getEquipmentByPartialName").mockResolvedValue([]);

        const req = { query: {} };
        const res = createMockResponse();

        await EquipmentController.getEquipmentByPartialName(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
        message: "Name query is required",
        });
    });

    it("should handle errors and return status 500", async () => {
      const error = new Error("Database error");
        jest
            .spyOn(InventoryService, "getEquipmentByPartialName")
            .mockRejectedValue(error);

        const req = { query: { name: "Drill" } };
        const res = createMockResponse();

        await EquipmentController.getEquipmentByPartialName(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });
    //updateEquipmentStatus tests
    describe("updateEquipmentStatus", () => {
    it("should update equipment status and return status 200", async () => {
        const mockUpdatedEquipment = {
        id: 1,
        name: "Drill",
        description: "Electric drill",
        status: "In Use"
        };
        jest
            .spyOn(InventoryService, "updateEquipmentStatus")
            .mockResolvedValue(mockUpdatedEquipment);

        const req = { params: { id: "1" }, body: { status: "In Use" } };
        const res = createMockResponse();

        await EquipmentController.updateEquipmentStatus(req, res);

        expect(InventoryService.updateEquipmentStatus).toHaveBeenCalledWith("1", { status: "In Use" });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
        message: "Stock updated",
        equipment: mockUpdatedEquipment
        });
    });

    it("should return 404 if equipment not found", async () => {
      jest.spyOn(InventoryService, "updateEquipmentStatus").mockResolvedValue(null);

        const req = { params: { id: "999" }, body: { status: "In Use" } };
        const res = createMockResponse();

        await EquipmentController.updateEquipmentStatus(req, res);
        
        expect(InventoryService.updateEquipmentStatus).toHaveBeenCalledWith("999", { status: "In Use" });
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Stock not found." });
    });
    it("should handle errors and return status 500", async () => {
      const error = new Error("Database error");
        jest
            .spyOn(InventoryService, "updateEquipmentStatus")
            .mockRejectedValue(error);

        const req = { params: { id: "1" }, body: { status: "In Use" } };
        const res = createMockResponse();

        await EquipmentController.updateEquipmentStatus(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
    });
});
});