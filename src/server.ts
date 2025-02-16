import dotenv from 'dotenv';
import express from 'express';
import weatherRoutes from './routes/api/weatherRoutes.js';
import htmlRoutes from './routes/htmlRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Add this line for startup logging
console.log('Starting server...');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Add some request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/', htmlRoutes);
app.use('/api/weather', weatherRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 