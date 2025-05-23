-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  uid VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255),
  role VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create produce table
CREATE TABLE IF NOT EXISTS produce (
  id SERIAL PRIMARY KEY,
  uid VARCHAR(100) REFERENCES users(uid),
  name TEXT,
  quantity INTEGER,
  unit TEXT,
  price INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  buyer_uid VARCHAR(100) REFERENCES users(uid),
  produce_id INTEGER REFERENCES produce(id),
  quantity INTEGER,
  commission INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 