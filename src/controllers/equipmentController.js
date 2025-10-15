import ProductModel from "../models/productModel.js";
import EquipmentModel from "../models/equipmentModel.js";
import {Op} from "sequelize"

class EquipmentController
{
    static async getAllEquipment(req, res)
    {
        try
        {
            const equipment = await EquipmentModel.findAll(
                {
                    include:
                    {
                        model: ProductModel
                    }
                }
            )
            res.status(200).json(equipment)
        } catch (e)
        {
            res.status(500).json({error: e.message})
        }
    }

    static async getEquipmentByID(req, res)
        {
            try
            {
                const equipment = await EquipmentModel.findByPk(req.params.id,
                {
                    include:
                    {
                        model: ProductModel
                    }
                }
                )
                if (!equipment)
                {
                    return res.status(404).json({message: "Equipment not found."})
                }
                res.status(200).json(equipment)
            }
            catch(e)
            {
                res.status(500).json({error: e.message})
            }
        }

        static async getEquipmentByPartialName(req, res)
        {
            try
            {
                const {name} = req.query
                if (!name)
                {
                    return res.status(400).json({message: "Name query is required"})
                }

                const equipment = await EquipmentModel.findAll(
                {
                    include:
                    [
                        {
                            model:ProductModel,
                            where:
                            {
                                name:
                                {
                                    [Op.like]: `%${name}%`
                                }
                            }
                        }
                    ]
                })

                res.status(200).json(equipment);
            }
            catch(e)
            {
                res.status(500).json({error: e.message})
            }
        }
}

export default EquipmentController