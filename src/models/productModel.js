import { DataTypes } from "sequelize"
import db from "../config/db.js"

class ProductModel
{
    constructor()
    {
        this.model = db.getInstance().define("Product",
            {
                id:
                {
                    primaryKey: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    autoIncrement: true,
                    unique: true
                },
                name:
                {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: false
                },
                description:
                {
                    type: DataTypes.STRING
                },
                price:
                {
                    type: DataTypes.FLOAT,
                    allowNull: false,
                    validate: {min: 0}
                }

            }
        )
    }

    getModel()
    {
        return this.model;
    }
}

export default new ProductModel().getModel();