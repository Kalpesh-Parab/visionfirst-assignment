import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import companyRoutes from './routes/companyRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Adjust as needed (5 seconds for testing)
      socketTimeoutMS: 60000, // Wait for up to 60 seconds for socket timeout
      maxPoolSize: 100, // Maximum number of sockets
      minPoolSize: 10, // Minimum number of sockets
      // New parser options
      useNewUrlParser: true, // Use new URL string parser
      useUnifiedTopology: true, // Use new Server Discover and Monitoring engine
    });
    console.log('WOOHOO MONGODB CONNECTED🎉🎉🎉');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

// Connect to MongoDB
connectDB();

//USER ROUTES

app.use('/api/users', userRoutes);
app.use('/api/companies', companyRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
