import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import express from 'express';

const router = express.Router();

// Serve the static files
router.get('/', (_req, res) => {
  res.sendFile(join(__dirname, '../../public/index.html'));
});

export default router; 