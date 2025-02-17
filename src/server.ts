import dotenv from 'dotenv';
import express from 'express';
import routes from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// TODO: Implement middleware to connect the routes
app.use(routes);

// Start the server on the port
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
