import dotenv from 'dotenv';
import { resolve } from 'path';
import express from 'express';
import routes from './routes';

// Load environment variables
const envPath = resolve(process.cwd(), '.env');
console.log('Loading .env from:', envPath);
dotenv.config({ path: envPath });

// Add detailed environment checks
if (!process.env.OPENWEATHER_API_KEY) {
  console.error('ERROR: OpenWeather API key is not configured in environment variables');
  process.exit(1);
}

console.log('Environment check passed - API Key is configured');
console.log('API Key length:', process.env.OPENWEATHER_API_KEY.length);
console.log('First 4 chars:', process.env.OPENWEATHER_API_KEY.substring(0, 4));

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add request logging middleware
app.use((req, res, next) => {
  console.log('Incoming request:', {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    query: req.query,
    body: req.body
  });
  next();
});

// Routes should come before static files
app.use(routes);

// Static files should be served last
app.use(express.static('public'));

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// Start the server on the port
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
