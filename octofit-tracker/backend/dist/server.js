import express from 'express';
import { connectDatabase } from './config/database.js';
import { Activity, Leaderboard, Team, User, Workout } from './models.js';
const app = express();
const port = 8000;
const codespaceName = process.env.CODESPACE_NAME;
const apiBaseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : `http://localhost:${port}`;
const allowedOrigins = new Set([
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    ...(codespaceName ? [`https://${codespaceName}-5173.app.github.dev`] : []),
]);
app.use((request, response, next) => {
    const origin = request.get('origin');
    if (origin && allowedOrigins.has(origin)) {
        response.setHeader('Access-Control-Allow-Origin', origin);
        response.setHeader('Vary', 'Origin');
    }
    if (request.method === 'OPTIONS') {
        response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        response.sendStatus(204);
        return;
    }
    next();
});
app.use(express.json());
app.get('/api/health', (_request, response) => {
    response.json({ status: 'ok', apiBaseUrl });
});
app.get('/api/users/', async (_request, response) => {
    response.json(await User.find().lean().exec());
});
app.get('/api/teams/', async (_request, response) => {
    response.json(await Team.find().lean().exec());
});
app.get('/api/activities/', async (_request, response) => {
    response.json(await Activity.find().lean().exec());
});
app.get('/api/leaderboard/', async (_request, response) => {
    response.json(await Leaderboard.find().sort({ points: -1 }).lean().exec());
});
app.get('/api/workouts/', async (_request, response) => {
    response.json(await Workout.find().lean().exec());
});
app.use((_request, response) => {
    response.status(404).json({ error: 'Not found' });
});
app.use((error, _request, response, _next) => {
    console.error('API request failed:', error);
    response.status(500).json({ error: 'Internal server error' });
});
async function startServer() {
    await connectDatabase();
    app.listen(port, '0.0.0.0', () => {
        console.log(`OctoFit API listening at ${apiBaseUrl}`);
    });
}
startServer().catch((error) => {
    console.error('Failed to start OctoFit API:', error);
    process.exitCode = 1;
});
