import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import factCheckRoutes from './api/factCheckRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/fact-check', factCheckRoutes);

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
