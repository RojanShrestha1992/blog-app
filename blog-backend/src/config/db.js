const mongoose = require('mongoose');

const connectDB = async () => {
     if (mongoose.connection.readyState === 1) {
          return mongoose.connection;
     }

     if (global.mongooseConnectionPromise) {
          await global.mongooseConnectionPromise;
          return mongoose.connection;
     }

     global.mongooseConnectionPromise = mongoose.connect(process.env.MONGO_URI, {
          maxPoolSize: 10,
          minPoolSize: 1,
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
     });

     try {
          await global.mongooseConnectionPromise;
          console.log('MongoDB connected');
          return mongoose.connection;
     } catch (err) {
          global.mongooseConnectionPromise = null;
          console.log(err);
          throw err;
     }
}

module.exports = connectDB;