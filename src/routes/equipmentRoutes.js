/**
 * @file equipmentRoutes.js
 * @description All the routes for the equipment.
 * @author Jax
 * @version 1.0.3
 * @date 2025-9-26
 * @module routes/equipment
 */

import express from "express"
import EquipmentController from "../controllers/equipmentController.js"

const router = express.Router()

/**
 * Retrieves a list of all equipment.
 * @name Get All Equipment
 * @route {GET} /api/equipment
 * @summary Fetch all equipment.
 * @returns {Array<Object>} 200 - An array of equipment objects.
 */
router.get("/", EquipmentController.getAllEquipment);

/**
 * Searches for equipment using a partial name match.
 * @name Search Equipment
 * @route {GET} /api/equipment/search
 * @summary Search equipment by name.
 * @param {string} name.query.required - The partial string to match against equipment names (e.g., ?name=lift).
 * @returns {Array<Object>} 200 - An array of matching equipment.
 */
router.get("/search", EquipmentController.getEquipmentByPartialName);

/**
 * Retrieves a single piece of equipment by its ID.
 * @name Get Equipment by ID
 * @route {GET} /api/equipment/:id
 * @summary Get equipment details.
 * @param {string} id.path.required - The unique Equipment ID.
 * @returns {Object} 200 - A single equipment object.
 */
router.get("/:id", EquipmentController.getEquipmentByID);

/**
 * Updates the status of a piece of equipment.
 * @name Update Equipment Status
 * @route {PUT} /api/equipment/:id
 * @summary Update equipment status (e.g., "Maintenance").
 * @param {string} id.path.required - The unique Equipment ID.
 * @param {Object} request.body.required - Object containing the new status.
 * @returns {Object} 200 - The updated equipment object.
 */
router.put("/:id", EquipmentController.updateEquipmentStatus)

export default router;