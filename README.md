# Inventory System Backend


## 🚀 Features
- REST API for managing and/or accessing:
  - Products
  - Stock
  - Equipment
  - Orders
- JSON request/response support
- Modular file structure (routes, controllers, models)
- Ready for database integration

## 📦 Requirements
- [Node.js](https://nodejs.org/en/download) (>= 18)
- npm (comes with Node)


## 📂 File Structure (Eventually)

```bash
inventory-system/
├── /public
│   ├── /images            # For any images used
│   ├── /scripts           # For javascripts
│   ├── /styles            # Css styles for pages
│   ├── index.html         # Root page '/'
├── server.js              # Entry point
├── package.json
├── /src
│   ├── /config            # DB config, env setup
│   ├── /controllers       # Request handlers
│   ├── /models            # Data models
│   ├── /routes            # API route definitions
│   ├── /middleware        # Express middleware
│   └── /utils             # Helpers
└── /tests                 # Unit/integration tests
```

## ⚙️ Installation

Clone the repo and install dependencies:

```bash
git clone https://github.com/Jax-Drummond/Project-V---Inventory-System
cd .\Project-V---Inventory-System\
npm install
```

## ▶️ Running The Server
### Dev Mode
`npm run dev`
### Production Mode
`npm start`
### Testing
`npm test`
