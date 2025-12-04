# 🧭 Inventory System Backend

A modular **Node.js + Express** backend providing RESTful APIs for managing inventory data including products, stock, equipment, and orders.

---

## 🚀 Features

* REST API for managing:

  * 🛒 Products
  * 📦 Stock
  * ⚙️ Equipment
  * 📑 Orders
* JSON request/response format
* Modular structure with clear separation of routes, controllers, and models
* Database-ready configuration setup

---

## 📦 Requirements

* [Node.js](https://nodejs.org/en/download) **>= 18**
* npm (comes with Node)

---

## 📂 File Structure

```bash
inventory-system/
├── /public
│   ├── /scripts           # Client-side JS
│   ├── /styles            # CSS stylesheets
│   └── index.html         # Root page
├── /src
│   ├── /service            # DB config, environment setup
│   ├── /controllers       # Request handlers
│   └── /routes            # API route definitions
├── /tests                 # Unit/integration tests
│   ├── /integration
│   └── /unit
├── app.js 
├── server.js              # Entry point
└── package.json
```

---

## ⚙️ Installation

Clone the repo and install dependencies:

```bash
git clone https://github.com/Jax-Drummond/Project-V---Inventory-System
cd Project-V---Inventory-System
npm install
```

---

## ▶️ Running the Server

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

### Testing

```bash
npm test
```

---

## 🧩 API Endpoints

### 📦 Products (`/api/products`)

| Method | Endpoint                 | Description                     |
| ------ | ------------------------ | ------------------------------- |
| `GET`  | `/`                      | Get all products                |
| `GET`  | `/search?name=<partial>` | Search products by partial name |
| `GET`  | `/:id`                   | Get a product by ID             |

---

### ⚙️ Equipment (`/api/equipment`)

| Method | Endpoint                 | Description                      |
| ------ | ------------------------ | -------------------------------- |
| `GET`  | `/`                      | Get all equipment                |
| `GET`  | `/search?name=<partial>` | Search equipment by partial name |
| `GET`  | `/:id`                   | Get equipment by ID              |
| `PUT`  | `/:id`                   | Update the Availability          |

---

### 🏗️ Stock (`/api/stock`)

| Method   | Endpoint | Description                               |
| -------- | -------- | ----------------------------------------- |
| `GET`    | `/`      | Get all stock records                     |
| `GET`    | `/:id`   | Get stock by ID                           |
| `POST`   | `/`      | Create new stock entry                    |
| `PUT`    | `/:id`   | Update stock (quantity, threshold, price) |
| `DELETE` | `/:id`   | Delete stock record                       |

---

### 🧾 Orders (`/api/orders`)

| Method   | Endpoint      | Description         |
| -------- | ------------- | ------------------- |
| `GET`    | `/`           | Get all orders      |
| `GET`    | `/:id`        | Get order by ID     |
| `POST`   | `/`           | Create a new order  |
| `PUT`    | `/:id/status` | Update order status |
| `DELETE` | `/:id`        | Delete order        |

---

## 📫 Example Requests

**Get all products**

```bash
GET /api/products
```

**Search for a product**

```bash
GET /api/products/search?name=vacuum
```
