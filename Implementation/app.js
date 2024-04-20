import express from 'express';
import { config } from 'dotenv';
import { fetcher1 } from './controllers/main.js';

const app = express();

config({ path: './data/config.env' });

app.get('/', (req, res) => {
  res.send('Working...');
});

app.get('/fetch', fetcher1);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on ${port} in Dev mode`);
});
