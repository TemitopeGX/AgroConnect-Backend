# 🚀 AgroConnect Naija – Backend API

This is the backend API for **AgroConnect Naija**, a farm produce aggregation platform that connects Nigerian farmers directly to buyers (restaurants, stores, food companies).

## 🔧 Tech Stack

| Tech               | Description                            |
| ------------------ | -------------------------------------- |
| ExpressJS          | Lightweight Node.js web framework      |
| Firebase Admin SDK | Auth verification and token decoding   |
| PostgreSQL (Neon)  | Scalable, serverless database          |
| JWT                | Admin session management (future use)  |
| Vercel             | Serverless hosting (via `api/` folder) |

## ✅ Features

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
- Commission calculated per order (5–10%)

## 📁 Project Structure

```
backend/
├── api/
│   ├── auth/
│   │   ├── check-user.js    # Verify existing users
│   │   └── create-user.js   # Register new users
│   ├── produce/
│   │   ├── create.js        # Add new produce
│   │   └── list.js         # List available produce
│   ├── orders/
│   │   ├── place.js        # Place new orders
│   │   └── my-orders.js    # View user orders
│   └── middleware/
│       └── verifyToken.js   # Firebase auth middleware
├── lib/
│   ├── db.js              # Database connection
│   └── firebase.js        # Firebase admin setup
├── __tests__/            # Test files
├── vercel.json           # Vercel configuration
└── package.json
```

## 🚀 Getting Started

1. Clone the repository:

```bash
git clone https://github.com/TemitopeGX/AgroConnect-Backend.git
cd AgroConnect-Backend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables in `.env`:

```env
DATABASE_URL=postgresql://username:password@host/dbname
FIREBASE_ADMIN_JSON=your-json-encoded-firebase-admin-sdk
```

4. Run tests:

```bash
npm test
```

5. Start development server:

```bash
npm run dev
```

## 🧪 Testing

The project includes comprehensive test coverage for:

- Authentication endpoints
- Produce management
- Order processing
- Role-based access control

Run tests with:

```bash
npm test
```

## 📦 Deployment

The project is configured for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy!

## 🗃️ Database Schema

```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  uid VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255),
  role VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Produce table
CREATE TABLE produce (
  id SERIAL PRIMARY KEY,
  uid VARCHAR(100) REFERENCES users(uid),
  name TEXT,
  quantity INTEGER,
  unit TEXT,
  price INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  buyer_uid VARCHAR(100) REFERENCES users(uid),
  produce_id INTEGER REFERENCES produce(id),
  quantity INTEGER,
  commission INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨🏿‍💻 Author

Created by **@TemitopeGX** — A Nigerian Fullstack Developer solving real-world problems.
