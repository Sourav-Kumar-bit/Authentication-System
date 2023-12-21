import mongoose from 'mongoose';

const connectDB = async (DATABASE_URL) => {
  try {
    await mongoose.connect(DATABASE_URL)
    console.log('Connected Successfully...')
  } catch (error) {
    console.log('Connection Error:', error.message)
  }
}

export default connectDB