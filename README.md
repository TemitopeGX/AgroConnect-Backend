# 🌾 AgroConnect Naija Backend

A farm produce aggregation platform connecting Nigerian farmers directly to buyers.

## 🚀 Features

- 👤 **Authentication**: Firebase-based auth with role management
- 📦 **Produce Management**: Farmers can list and manage their produce
- 🛒 **Order System**: Buyers can place orders with automated commission calculation
- 💳 **Transaction Handling**: Secure database transactions for orders
- 🔐 **Role-Based Access**: Separate farmer and buyer functionalities

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Neon PostgreSQL (Serverless)
- **Authentication**: Firebase Admin SDK
- **Deployment**: Vercel Serverless Functions

## 📋 Prerequisites

- Node.js >= 14.0.0
- Firebase Project
- Neon PostgreSQL Database
- Vercel Account (for deployment)

## 🔧 Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/agroconnect-naija-backend.git
   cd agroconnect-naija-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file:

   ```env
   DATABASE_URL=your_neon_postgres_url
   FIREBASE_ADMIN_JSON=your_firebase_admin_sdk_json
   ```

4. **Database Setup**
   ```bash
   npm run migrate
   ```

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Run with coverage:

```bash
npm run test:coverage
```

## 🚀 Deployment

1. **Connect to Vercel**

   ```bash
   vercel
   ```

2. **Set Environment Variables in Vercel**

   - Add `DATABASE_URL`
   - Add `FIREBASE_ADMIN_JSON`

3. **Deploy**
   ```bash
   vercel --prod
   ```

## 📝 API Documentation

### Authentication

- `POST /api/auth/create-user`: Register new user
- `POST /api/auth/check-user`: Verify user exists

### Produce

- `POST /api/produce/create`: Create produce listing
- `GET /api/produce/list`: List available produce

### Orders

- `POST /api/orders/place`: Place new order
- `GET /api/orders/my-orders`: View user's orders

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Your Name - [@yourusername](https://github.com/yourusername)
