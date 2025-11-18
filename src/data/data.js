export const products = [
    { id: 1, name: "Proton Pack Mk IV", description: "Portable nuclear accelerator. Unlicensed.", price: 5000.00 },
    { id: 2, name: "Ghost Trap", description: "High-voltage containment unit with pedal.", price: 600.00 },
    { id: 3, name: "P.K.E. Meter", description: "Psychokinetic Energy detection handheld.", price: 350.00 },
    { id: 4, name: "Ecto Goggles", description: "Paranormal visual spectrum enhancer.", price: 250.00 },
    { id: 5, name: "Stay Puft Marshmallows", description: "Standard camping supply.", price: 5.99 },
    { id: 6, name: "Slime Blower", description: "Positively charged mood slime dispenser.", price: 4200.00 }
];

export const stocks = [
    { id: 1, qty: 4, threshold: 2, price: 5000, productId: 1 }, // Proton Packs
    { id: 2, qty: 12, threshold: 5, price: 600, productId: 2 }, // Traps
    { id: 3, qty: 3, threshold: 2, price: 350, productId: 3 },  // PKE Meters
    { id: 4, qty: 50, threshold: 10, price: 6, productId: 5 },  // Marshmallows
    { id: 5, qty: 0, threshold: 1, price: 4200, productId: 6 }  // Slime Blowers (Out of stock)
];

export const equipment = [
    { id: 1, qty: 1, status: "In Use (Venkman)", productId: 1 },
    { id: 2, qty: 1, status: "Damaged", productId: 1 },
    { id: 3, qty: 1, status: "Available", productId: 2 },
    { id: 4, qty: 1, status: "In Use (Spengler)", productId: 3 }
];

export const orders = [
    { id: 1, qty: 2, date: new Date(), cost: 1200, status: "Pending", stockId: 2 }, // Ordering more traps
    { id: 2, qty: 1, date: new Date(), cost: 4200, status: "Backordered", stockId: 5 }, // Ordering a Slime Blower
    { id: 3, qty: 20, date: new Date(), cost: 120, status: "Shipped", stockId: 4 } // Restocking Marshmallows
];