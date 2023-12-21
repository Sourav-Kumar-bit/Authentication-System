import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/connectdb.js';
import userRoutes from './routes/userRoutes.js'

dotenv.config();

const app = express();
const port = process.env.PORT || 4000; // Set a default port if PORT is not defined in the environment
// const DATABASE_URL = process.env.DATABASE_URL;
const DATABASE_URL = process.env.MONGODB_URL

// CORS Policy
app.use(cors());

// JSON
app.use(express.json());

// Load Routes
app.use("/api/user", userRoutes);

// Cookie Parser
app.use(cookieParser);

// Database Connection
const startServer = async () => {
  try {
    await connectDB(DATABASE_URL);
    console.log('Connected to the database successfully...');
    app.listen(port, () => {
      console.log(`Server listening at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
  }
};

// Start the server after connecting to the database
startServer();
