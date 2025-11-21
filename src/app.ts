import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import routes from './routes/transcriptionRoutes.js';
import workflowRoutes from './routes/workflowRoutes.js';

dotenv.config();

const app = express();

const allowedOrigins = [
  "https://voiceowl-frontend.onrender.com",
  "http://localhost:5173"
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.options("(.*)", cors());  // important for preflight

app.use(express.json());
app.use('/api', routes);
app.use('/api', workflowRoutes);

// DB and other code…
mongoose.connect(process.env.MONGO_URI || '', {
  dbName: 'voiceowl-backend'
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error', err);
});

export default app;
