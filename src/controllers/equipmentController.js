import InventoryService from "../services/inventoryService.js";

class EquipmentController {
    static async getAllEquipment(req, res) {
        try {
            const equipment = await InventoryService.getAllEquipment();
            res.status(200).json(equipment);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

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

    static async getEquipmentByPartialName(req, res) {
        try {
            const { name } = req.query;
            if (!name) {
                return res.status(400).json({ message: "Name query is required" });
            }

            // Complex query handled by service now
            const equipment = await InventoryService.getEquipmentByPartialName(name);

            res.status(200).json(equipment);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
}

export default EquipmentController;