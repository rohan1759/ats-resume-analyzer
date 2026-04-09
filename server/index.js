import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import analyzeRoute from './routes/analyze.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/analyze', analyzeRoute);

// Health check
app.get('/', (req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
