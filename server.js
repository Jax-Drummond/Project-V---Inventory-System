/**
 * @file server.js
 * @description Acts as the entry point of the
 * @author Jax
 * @version 1.0.0
 * @date 2025-9-24
 * @module app
 */

import app from "./app.js"

const PORT = 7198

app.listen(PORT, "0.0.0.0", () =>
{
    console.log(`Server is now running on port ${PORT}`)
});

export default app