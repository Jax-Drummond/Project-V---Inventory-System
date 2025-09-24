import express from "express"
import volleyball from "volleyball"
import db from "./src/config/db.js"

// Route Imports
import productRoutes from "./src/routes/productRoutes.js"


const app = express()
const PORT = 7198

// Parses Json request bodies
app.use(express.json())

// Logger
app.use(volleyball)

/* Routes go here
    e.g. app.use('/api/products", productRoutes);
*/

/*
backend/
│
├── package.json
├── package-lock.json
├── server.js              # Entry point (start Express server)
│
├── /src
│   ├── /config            # Configuration files (db, env, etc.)
│   │   └── db.js
│   │
│   ├── /models            # Database models / schemas
│   │   ├── productModel.js
│   │   ├── stockModel.js
│   │   ├── equipmentModel.js
│   │   └── orderModel.js
│   │
│   ├── /routes            # Express route definitions
│   │   ├── productRoutes.js
│   │   ├── stockRoutes.js
│   │   ├── equipmentRoutes.js
│   │   └── orderRoutes.js
│   │
│   ├── /controllers       # Route logic (business rules)
│   │   ├── productController.js
│   │   ├── stockController.js
│   │   ├── equipmentController.js
│   │   └── orderController.js
│   │
│   ├── /services          # Optional: service layer (e.g., calculations, thresholds)
│   │   └── inventoryService.js
│   │
│   ├── /middleware        # Custom middleware (e.g., auth, logging)
│   │   └── errorHandler.js
│   │
│   └── /utils             # Helpers (formatters, validators, etc.)
│       └── logger.js
│
└── /tests                 # Unit/integration tests
    ├── product.test.js
    └── stock.test.js

*/

// Mount Routes
app.use("/api/products", productRoutes)

app.get('/', (req, res) =>
{
    res.send("Hello World!!")
})

// Start Server
app.listen(PORT, "0.0.0.0", () =>
{
    console.log(`Server is now running on port ${PORT}`)
    db.connect()
});

