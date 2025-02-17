import { Router } from 'express';
import weatherRoutes from './weatherRoutes';

const router = Router();

// Add debug middleware
router.use((req, res, next) => {
  console.log('API Route hit:', req.method, req.path);
  next();
});

// Handle both /api/weather and /weather
router.use('/weather', weatherRoutes);  // This will match /api/weather
router.use('/', weatherRoutes);         // This will match /weather

export default router; 