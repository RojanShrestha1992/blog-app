require('dotenv').config();

const app = require('./src/app');
const connectDB = require('./src/config/db');

// connect db
connectDB();

if (process.env.VERCEL) {
    module.exports = app;
} else {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`server running on port ${PORT}`)
    })
}