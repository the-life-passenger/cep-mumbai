import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB, getDBStatus } from './config/db.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import surveyRoutes from './routes/surveyRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

import { notFound, errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health & System Status Endpoint
app.get('/api/status', (req, res) => {
  const dbStatus = getDBStatus();
  res.json({
    status: 'healthy',
    project: 'MyLocal Services - University of Mumbai B.Sc. CS Sem V CEP',
    title: 'Mapping Essential Public Services',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/surveys', surveyRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/upload', uploadRoutes);

// Serve frontend production build in production
const frontendDist = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDist));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    return next();
  }
  res.sendFile(path.join(frontendDist, 'index.html'));
});

// Error Handling
app.use(notFound);
app.use(errorHandler);

// Connect DB and Start Server
async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 MyLocal Services CEP Server running on port ${PORT}`);
    console.log(`📍 API Base: http://localhost:${PORT}/api`);
    console.log(`📡 Status: http://localhost:${PORT}/api/status`);
    console.log(`=======================================================`);
  });
}

startServer();
