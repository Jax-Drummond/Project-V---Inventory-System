import { DataTypes } from "sequelize"
import db from "../config/db.js"
import ProductModel from "./productModel.js";

class StockModel
{
    constructor()
    {
        this.model = db.getInstance().define("Stock",
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
                threshold:
                {
                    type: DataTypes.INTEGER
                },
                price:
                {
                    type: DataTypes.INTEGER,
                    allowNull: true,
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

export default new StockModel().getModel();