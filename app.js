import express from "express"
import volleyball from "volleyball"
import path from "path"

// Route Imports
import dashboardRoutes from "./src/routes/dashboardRoutes.js";
import productRoutes from "./src/routes/productRoutes.js"
import equipmentRoutes from "./src/routes/equipmentRoutes.js"
import stockRoutes from "./src/routes/stockRoutes.js"
import orderRoutes from "./src/routes/orderRoutes.js"
const __dirname = path.resolve()

const app = express()


// Parses Json request bodies
app.use(express.json())

// Logger
app.use(volleyball)

// Static Frontend
app.use(express.static(path.join(__dirname, "public")))

// Mount Routes
app.use("/api/products", productRoutes)
app.use("/api/equipment", equipmentRoutes)
app.use("/api/stock", stockRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/dashboard", dashboardRoutes);

app.get('/test', (req, res) =>
{
    res.send("Hello World!!")
})

export default app