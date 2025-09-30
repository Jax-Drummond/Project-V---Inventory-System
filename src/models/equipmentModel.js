import { DataTypes } from "sequelize"
import db from "../config/db.js"
import ProductModel from "./productModel.js";

class EquipmentModel
{
    constructor()
    {
        this.model = db.getInstance().define("Equipment",
            {
                id:
                {
                    primaryKey: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    autoIncrement: true,
                    unique: true
                },
                qty:
                {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    unique: false
                },
                status:
                {
                    type: DataTypes.STRING
                },
                productId:
                {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references:
                    {
                        model: ProductModel,
                        key: "id",
                    }
                }

            }
        )
    }

    getModel()
    {
        return this.model;
    }
}

const equipmentModel = new EquipmentModel().getModel()

equipmentModel.belongsTo(ProductModel, {foreignKey: "productId"})
ProductModel.hasMany(equipmentModel, {foreignKey: "productId"})

export default equipmentModel;