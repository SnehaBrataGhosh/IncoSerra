import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import depositRoutes from './routes/deposit.js';
import claimRoutes from './routes/claim.js';
import processRoutes from './routes/process.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());

app.use(
  session({
    name: 'incoserra.sid',
    secret: process.env.SESSION_SECRET || 'dev-only-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
      secure: process.env.COOKIE_SECURE === 'true',
    },
  })
);

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/deposit', depositRoutes);
app.use('/api/claim', claimRoutes);
app.use('/api/process', processRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'IncoSerra API' });
});

app.listen(PORT, () => {
  console.log(`IncoSerra API listening on http://localhost:${PORT}`);
});
