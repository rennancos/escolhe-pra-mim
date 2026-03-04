const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const pinoHttp = require('pino-http');
const logger = require('./utils/logger');
const { errorHandler, notFound } = require('./middlewares/errorMiddleware');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const contentRoutes = require('./routes/contentRoutes');
const listRoutes = require('./routes/listRoutes');
require('dotenv').config();

const app = express();

// Security and Utilities
app.use(helmet());
app.use(cookieParser());
app.use(pinoHttp({ logger }));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/contents', contentRoutes);
app.use('/api/lists', listRoutes);
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
