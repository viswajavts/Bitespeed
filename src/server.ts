import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import identifyRoute from './routes/identifyRoute';
import healthRoute from './routes/healthRoute';
import rootRoute from './routes/rootRoute';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/identify', identifyRoute);
app.use('/health', healthRoute); // optional 
app.use('/', rootRoute);

// Global error handler
app.use(errorHandler);

// 404 fallback
// app.use('*', (req, res) => {
//   res.status(404).json({
//     success: false,
//     message: 'Route not found',
//     availableRoutes: ['/identify', '/health']
//   });
// });
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    availableRoutes: ['/identify', '/health']
  });
});


export default app;
