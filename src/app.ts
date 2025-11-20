import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';                
import routes from './routes/transcriptionRoutes.js';
import workflowRoutes from './routes/workflowRoutes.js'; 

dotenv.config();

const app = express();

app.use(cors());                      
app.use(express.json());
app.use('/api', routes);
app.use('/api', workflowRoutes);         

console.log(process.env.MONGO_URI)
mongoose.connect(process.env.MONGO_URI || '', {
  dbName: 'voiceowl-backend'
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error', err);
});

export default app;
