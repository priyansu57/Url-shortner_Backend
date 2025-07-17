const mongoose = require('mongoose');

 async function connectDB() {
    await mongoose.connect(process.env.MONGO_URI)
    
 }
connectDB()
  .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

    

export default connectDB;
