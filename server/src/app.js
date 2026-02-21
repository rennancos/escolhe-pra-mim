const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { errorHandler, notFound } = require('./middlewares/errorMiddleware');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const contentRoutes = require('./routes/contentRoutes');
require('dotenv').config();

const app = express();

// Security and Utilities
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || '*', // Set CLIENT_URL in production
}));
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/contents', contentRoutes);
// Montando auth routes em /api para manter compatibilidade (/api/login, /api/me)
app.use('/api', authRoutes);

// Health Check
app.get('/', (req, res) => {
  res.json({ message: 'Escolhe Pra Mim API is running!' });
});

// Error Handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
