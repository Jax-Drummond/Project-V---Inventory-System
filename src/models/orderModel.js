import { DataTypes } from "sequelize"
import db from "../config/db.js"
import StockModel from "./stockModel.js";

class OrderModel
{
    constructor()
    {
        this.model = db.getInstance().define("Order",
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
                    validate: {min: 0}
                },
                date:
                {
                    type: DataTypes.date,
                    allowNull: false
                },
                cost:
                {
                    type: DataTypes.FLOAT,
                    allowNull: false,
                },
                status:
                {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                stockId: 
                {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references:
                    {
                        model: StockModel,
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

export default new OrderModel().getModel();