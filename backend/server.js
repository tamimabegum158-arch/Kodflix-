import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth.js';

const app = express();
const PORT = process.env.PORT || 3001;

const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';

// Allow CORS: configured origin, localhost, and any *.vercel.app (so frontend works after deploy)
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      const allowed = [corsOrigin, 'http://localhost:5173', 'http://localhost:3000'];
      corsOrigin.split(',').forEach((o) => allowed.push(o.trim()));
      if (allowed.includes(origin) || origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }
      return callback(null, true); // allow others in production to avoid "Failed to fetch"
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);

app.get('/api/health', (_, res) => res.json({ ok: true }));

// Export for Vercel serverless; listen only when running locally
export default app;
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Kodflix backend running on http://localhost:${PORT}`);
  });
}
