# 🚀 AgroConnect Naija - Frontend Integration Guide

This guide will help you integrate the AgroConnect Naija backend API with your React Native (Expo) application.

## 📋 Table of Contents

- [Setup](#-setup)
- [Authentication](#-authentication)
- [API Integration](#-api-integration)
- [Role-Based Flows](#-role-based-flows)
- [Error Handling](#-error-handling)
- [Testing](#-testing)

## 🔧 Setup

### 1. Install Required Dependencies

```bash
# Install Firebase
npm install @react-native-firebase/app @react-native-firebase/auth

# Install Axios for API calls
npm install axios

# Install Secure Storage for token
npm install @react-native-async-storage/async-storage
```

### 2. Create API Client

Create a file `src/services/api.js`:

```javascript
import axios from "axios";
import auth from "@react-native-firebase/auth";

const API_URL = "https://agro-connect-backend.vercel.app";

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  try {
    const token = await auth().currentUser?.getIdToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    return Promise.reject(error);
  }
});

export default api;
```

## 🔐 Authentication

### 1. Firebase Setup

In `src/services/firebase.js`:

```javascript
import auth from "@react-native-firebase/auth";

export const loginUser = async (email, password) => {
  try {
    const response = await auth().signInWithEmailAndPassword(email, password);
    await checkUserRole(response.user.uid);
    return response.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const registerUser = async (email, password, role) => {
  try {
    // 1. Create Firebase user
    const response = await auth().createUserWithEmailAndPassword(
      email,
      password
    );

    // 2. Register role in our backend
    await api.post("/api/auth/create-user", {
      uid: response.user.uid,
      email,
      role,
    });

    return response.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const checkUserRole = async (uid) => {
  try {
    const response = await api.post("/api/auth/check-user", { uid });
    return response.data;
  } catch (error) {
    throw new Error("Failed to check user role");
  }
};
```

## 🔄 API Integration

### 1. Produce Management

In `src/services/produce.js`:

```javascript
import api from "./api";

export const produceService = {
  // List all available produce
  listProduce: async () => {
    try {
      const response = await api.get("/api/produce/list");
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch produce");
    }
  },

  // Create new produce listing (Farmers only)
  createProduce: async (produceData) => {
    try {
      const response = await api.post("/api/produce/create", produceData);
      return response.data;
    } catch (error) {
      throw new Error("Failed to create produce listing");
    }
  },
};
```

### 2. Order Management

In `src/services/orders.js`:

```javascript
import api from "./api";

export const orderService = {
  // Place a new order (Buyers only)
  placeOrder: async (produceId, quantity) => {
    try {
      const response = await api.post("/api/orders/place", {
        produce_id: produceId,
        quantity,
      });
      return response.data;
    } catch (error) {
      throw new Error("Failed to place order");
    }
  },

  // Get user's orders (Both Farmers and Buyers)
  getMyOrders: async () => {
    try {
      const response = await api.get("/api/orders/my-orders");
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch orders");
    }
  },
};
```

## 👥 Role-Based Flows

### 1. Farmer Flow

```javascript
// Example Farmer Screen
import React, { useState } from "react";
import { produceService } from "../services/produce";

export const CreateProduceScreen = () => {
  const [produceData, setProduceData] = useState({
    name: "",
    quantity: 0,
    unit: "",
    price: 0,
  });

  const handleSubmit = async () => {
    try {
      await produceService.createProduce(produceData);
      // Handle success
    } catch (error) {
      // Handle error
    }
  };

  // ... render form
};
```

### 2. Buyer Flow

```javascript
// Example Buyer Screen
import React, { useEffect, useState } from "react";
import { produceService, orderService } from "../services";

export const BrowseProduceScreen = () => {
  const [produceList, setProduceList] = useState([]);

  useEffect(() => {
    loadProduce();
  }, []);

  const loadProduce = async () => {
    try {
      const data = await produceService.listProduce();
      setProduceList(data);
    } catch (error) {
      // Handle error
    }
  };

  const handleOrder = async (produceId, quantity) => {
    try {
      await orderService.placeOrder(produceId, quantity);
      // Handle success
    } catch (error) {
      // Handle error
    }
  };

  // ... render list
};
```

## ❌ Error Handling

Create a utility for consistent error handling:

```javascript
// src/utils/errorHandler.js
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    switch (error.response.status) {
      case 400:
        return "Invalid request. Please check your input.";
      case 401:
        return "Please login again.";
      case 403:
        return "You are not authorized for this action.";
      case 404:
        return "Resource not found.";
      default:
        return "An unexpected error occurred.";
    }
  } else if (error.request) {
    // No response received
    return "Network error. Please check your connection.";
  } else {
    // Other errors
    return error.message;
  }
};
```

## 🧪 Testing

### API Testing

```javascript
// Example test for produce service
import { produceService } from "../services/produce";

describe("Produce Service", () => {
  it("should list available produce", async () => {
    const produce = await produceService.listProduce();
    expect(Array.isArray(produce)).toBe(true);
  });
});
```

## 📱 Example Screens

### Login Flow

1. Login/Register Screen
2. Role Selection (for new users)
3. Route to appropriate dashboard based on role

### Farmer Screens

1. Dashboard with produce listings
2. Create Produce form
3. Order requests view
4. Profile/Settings

### Buyer Screens

1. Browse Produce catalog
2. Order placement flow
3. Order history
4. Profile/Settings

## 🔍 Common Issues & Solutions

1. **Authentication Issues**

   - Ensure Firebase is properly initialized
   - Check if token is being sent in requests
   - Verify user role is properly set

2. **API Errors**

   - Check network connection
   - Verify request payload format
   - Ensure proper authorization headers

3. **State Management**
   - Use Context or Redux for user role
   - Cache produce listings when appropriate
   - Handle loading and error states

## 📚 Resources

- [Backend API Documentation](https://github.com/TemitopeGX/AgroConnect-Backend#-api-routes)
- [Firebase Authentication](https://rnfirebase.io/auth/usage)
- [Expo Documentation](https://docs.expo.dev)

## 🤝 Need Help?

For backend-related issues:

- Create an issue on [GitHub](https://github.com/TemitopeGX/AgroConnect-Backend/issues)
- Contact the backend team

For frontend questions:

- Check the React Native documentation
- Refer to the example implementations above
- Contact the frontend team lead
