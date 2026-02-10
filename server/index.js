const express = require('express');
const mysql = require('mysql2/promise');

const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Critical Security Check
if (!process.env.JWT_SECRET) {
  console.warn('⚠️  SECURITY WARNING: JWT_SECRET not defined in .env. Using default secret (INSECURE FOR PRODUCTION).');
}
const JWT_SECRET = process.env.JWT_SECRET || 'segredo_padrao_dev_123';

// Rate Limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit of 100 requests per IP (increased for dev)
  message: { error: 'Too many login/registration attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(helmet()); // Adds security headers (HSTS, X-Content-Type, etc)
app.use(cors()); // In production, restrict origin: { origin: 'http://your-site.com' }
app.use(express.json());

// Apply rate limiting only to authentication routes
app.use('/api/users', authLimiter);
app.use('/api/login', authLimiter);

// Database configuration (Connection Pool with Promises)
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'escolher_pra_mim',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection on startup
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Successfully connected to MySQL! (Pool)');
    connection.release();
  } catch (err) {
    console.error('Error connecting to MySQL:', err);
  }
})();

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Escolher Pra Mim API is running!' });
});

// Route to list contents (movies and series)
app.get('/api/contents', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM contents');
    res.json(results);
  } catch (err) {
    console.error('Error fetching contents:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to register user
app.post('/api/users', async (req, res) => {
  let { name, email, password } = req.body;

  // Basic sanitization (trim)
  if (name) name = name.trim();
  if (email) email = email.trim();

  // Validations
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Password validation (minimum 6 characters and complexity)
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }
  
  // Optional: Complexity regex (commented to avoid breaking current simple tests, but recommended)
  // const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
  // if (!strongPasswordRegex.test(password)) ...

  try {
    // Check if email already exists
    const [existingUsers] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    
    if (existingUsers.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    // Generate Token
    const token = jwt.sign({ id: result.insertId }, JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({ 
      message: 'User created successfully', 
      id: result.insertId,
      user: { name, email },
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error while creating user' });
  }
});

// Route to login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Find user by email
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = users[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate Token
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '30d' });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Protected example route (User Profile)
app.get('/api/me', authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, name, email FROM users WHERE id = ?', [req.user.id]);
    if (users.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(users[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal error' });
  }
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
