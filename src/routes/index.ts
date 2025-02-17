import { Router } from 'express';
import apiRoutes from './api';
import htmlRoutes from './htmlRoutes';
import weatherRoutes from './api/weatherRoutes';

const router = Router();

// Handle direct /weather requests
router.use('/weather', weatherRoutes);

// API routes
router.use('/api', apiRoutes);

// HTML routes should come last
router.use('/', htmlRoutes);

export default router; 