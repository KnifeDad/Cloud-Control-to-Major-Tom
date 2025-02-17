import { Router } from 'express';
import apiRoutes from './api';
import htmlRoutes from './htmlRoutes';

const router = Router();

router.use('/api', apiRoutes);
router.use('/', htmlRoutes);

export default router; 