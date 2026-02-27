import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth.js';

const app = express();
const PORT = process.env.PORT || 3001;

const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';

app.use(
  cors({
    origin: corsOrigin,
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
