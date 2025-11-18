import app from "./app.js"

const PORT = 7198

// Start Server
app.listen(PORT, "0.0.0.0", () =>
{
    console.log(`Server is now running on port ${PORT}`)
});

export default app