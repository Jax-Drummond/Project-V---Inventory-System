import app from "./app.js"
import db from "./src/config/db.js"
import "./src/models/associations.js"

const PORT = 7198

// Start Server
app.listen(PORT, "0.0.0.0", () =>
{
    console.log(`Server is now running on port ${PORT}`)
    db.connect()
});

export default app