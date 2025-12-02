import express from "express"
import EquipmentController from "../controllers/equipmentController.js"

const router = express.Router()

// Get all equipment
router.get("/", EquipmentController.getAllEquipment);

// Search equipment by partial name (query param: ?name=...)
router.get("/search", EquipmentController.getEquipmentByPartialName);

// Get single equipment by ID (route param)
router.get("/:id", EquipmentController.getEquipmentByID);

// Update the status
router.put("/:id", EquipmentController.updateEquipmentStatus)

export default router;