/**
 * @file equipmentController.js
 * @description All the routes functionality for the equipment.
 * @author Jax
 * @version 1.1.1
 * @date 2025-9-26
 * @module EquipmentController
 */

import InventoryService from "../services/inventoryService.js";

/**
 * Controls all of the functionality for the equipment endpoints.
 * @class
 */
class EquipmentController {
    /**
     * Gets all the equipment.
     * @param {object} req The request.
     * @param {object} res The response.
     */
    static async getAllEquipment(req, res) {
        try {
            const equipment = await InventoryService.getAllEquipment();
            res.status(200).json(equipment);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    /**
     * Gets equipment by id.
     * @param {object} req The request.
     * @param {object} res The response.
     * @returns A response.
     */
    static async getEquipmentByID(req, res) {
        try {
            const equipment = await InventoryService.getEquipmentById(req.params.id);
            if (!equipment) {
                return res.status(404).json({ message: "Equipment not found." });
            }
            res.status(200).json(equipment);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    /**
     * Gets equipment by name.
     * @param {object} req The request.
     * @param {object} res The response.
     * @returns A response.
     */
    static async getEquipmentByPartialName(req, res) {
        try {
            const { name } = req.query;
            if (!name) {
                return res.status(400).json({ message: "Name query is required" });
            }

            // Complex query handled by service now
            const equipment = await InventoryService.getEquipmentByPartialName(name);

            if (!equipment[0])
            {
                return res.status(404).json({ message: "Equipment Not Found." });
            }

            res.status(200).json(equipment);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    /**
     * Updates an equipment.
     * @param {object} req The request.
     * @param {object} res The Response.
     * @returns A response.
     */
    static async updateEquipmentStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const updatedEquipmentStatus = await InventoryService.updateEquipmentStatus(id, { status });
            if (!updatedEquipmentStatus) {
                return res.status(404).json({ message: "Equipment not found." });
            }

            res.status(200).json({
                message: "Stock updated",
                equipment: updatedEquipmentStatus
            });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
}

export default EquipmentController;