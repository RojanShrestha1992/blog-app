const dotenv = require('dotenv');
const app = require('./src/app');
const connectDB = require('./src/config/db');

dotenv.config();

// connect db
connectDB();
app.listen(3000, () => {
    console.log('server running on port 3000')
})