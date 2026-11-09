import express from 'express';

const app = express();

app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.listen(8000, '0.0.0.0', () => {
  console.log('OctoFit API listening on port 8000');
});