import express from "express"
import volleyball from "volleyball"
import db from "./src/config/db.js"
import path from "path"
import { fileURLToPath } from "url"

// Route Imports
import productRoutes from "./src/routes/productRoutes.js"
import equipmentRoutes from "./src/routes/equipmentRoutes.js"
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

app.get('/test', (req, res) =>
{
    res.send("Hello World!!")
})

export default app