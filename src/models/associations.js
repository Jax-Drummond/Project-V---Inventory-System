import Product from "./productModel.js";
import Equipment from "./equipmentModel.js";

Equipment.belongsTo(Product, { foreignKey: "productId" });
Product.hasMany(Equipment, { foreignKey: "productId" });