
# 🚀 AgroConnect Naija – Backend API

This is the backend API for **AgroConnect Naija**, a farm produce aggregation platform that connects Nigerian farmers directly to buyers (restaurants, stores, food companies).

---

## 🔧 Tech Stack

| Tech         | Description                             |
|--------------|-----------------------------------------|
| ExpressJS    | Lightweight Node.js web framework       |
| Firebase Admin SDK | Auth verification and token decoding |
| PostgreSQL (Neon) | Scalable, serverless database       |
| JWT          | Admin session management (future use)   |
| Vercel       | Serverless hosting (via `api/` folder)  |

---

## ✅ Features (Implemented Now)

### 🔐 Authentication
- Firebase Auth token verification via middleware
- Role-based access management (farmer, buyer, admin)

### 👤 User Management
- Register and store role after Firebase auth
- Role-specific screen rendering handled by frontend
- Prevent duplicate DB entries on new logins

### 📦 Produce Listings
- Farmers can post farm produce with:
  - Product name
  - Quantity
  - Price per unit
  - Availability status

### 🛒 Orders
- Buyers can:
  - View all available produce
  - Place order for specific quantity
- Order linked to both buyer & farmer
- Commission to be calculated per order (5–10%)

---

## 🧩 Features (Planned for Later)

- 📦 Delivery Scheduling (with GPS & Google Maps)
- 📲 In-App Notifications
- 💬 Chat between Farmer ↔ Buyer
- 👨🏿‍💼 Admin dashboard (Web)
- 📊 Analytics & Reporting for Admin
- 💼 Corporate Accounts (Food companies, processors)
- 🔍 Search/Filter functionality (by product, state, price)

---

## 📁 Folder Structure

```
backend/
├── api/
│   ├── auth/
│   │   ├── check-user.js
│   │   └── create-user.js
│   ├── produce/
│   │   ├── create.js
│   │   └── list.js
│   ├── orders/
│   │   ├── place.js
│   │   └── my-orders.js
│   └── middleware/
│       └── verifyToken.js
├── lib/
│   ├── db.js
│   └── firebase.js
├── vercel.json
├── .env
└── README.md
```

---

## 🧪 API Routes

### 🔐 Auth

#### `POST /api/auth/check-user`
> Checks if a Firebase user exists in DB.

```json
{
  "uid": "FIREBASE_UID"
}
```

#### `POST /api/auth/create-user`
> Adds new user to DB with role.

```json
{
  "uid": "FIREBASE_UID",
  "email": "user@email.com",
  "role": "farmer" // or buyer
}
```

---

### 📦 Produce

#### `POST /api/produce/create`
> Farmer adds a produce listing.

```json
{
  "uid": "FIREBASE_UID",
  "name": "Yam",
  "quantity": 30,
  "unit": "bags",
  "price": 5000
}
```

#### `GET /api/produce/list`
> Buyer fetches available produce.

```json
[
  {
    "id": 1,
    "name": "Yam",
    "quantity": 30,
    "unit": "bags",
    "price": 5000,
    "farmer": {
      "email": "farmer@email.com"
    }
  }
]
```

---

### 🛒 Orders

#### `POST /api/orders/place`
> Buyer places an order.

```json
{
  "produce_id": 1,
  "quantity": 5
}
```

#### `GET /api/orders/my-orders`
> Buyer or Farmer views their own orders.

---

## 🗃️ PostgreSQL Tables (via Neon)

```sql
-- USERS
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  uid VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255),
  role VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PRODUCE
CREATE TABLE produce (
  id SERIAL PRIMARY KEY,
  uid VARCHAR(100) REFERENCES users(uid),
  name TEXT,
  quantity INTEGER,
  unit TEXT,
  price INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ORDERS
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  buyer_uid VARCHAR(100) REFERENCES users(uid),
  produce_id INTEGER REFERENCES produce(id),
  quantity INTEGER,
  commission INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔐 Firebase Admin Setup

- Create Firebase project
- Enable Email or Phone Auth
- Download Admin SDK and place JSON file in `lib/firebase.js`
- Use it to initialize:

```js
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
```

---

## ⚙️ Environment Variables

Create `.env` file with:

```env
DATABASE_URL=postgresql://username:password@host/dbname
FIREBASE_ADMIN_JSON=your-json-encoded-firebase-admin-sdk
```

---

## 🚀 Deploying to Vercel

1. Login to Vercel and link GitHub repo
2. Move API logic inside `api/` folder (already structured)
3. Set environment variables in Vercel dashboard
4. Push your backend to GitHub

---

## 📈 Scaling Later

| Feature             | Tool / Plan                         |
|---------------------|-------------------------------------|
| Google Maps         | Google Places API (payment required)|
| Delivery Mgmt       | 3rd-party API or in-house logistics |
| Push Notification   | Expo Notifications / Firebase FCM   |
| File Upload (Admin) | Firebase Storage / Cloudinary       |

---

## 👨🏿‍💻 Created by

**@yourhandle** — A Nigerian Fullstack Dev solving real-world problems.

---

## 💡 Suggestions or Contributions?

Open an issue or send a pull request!
