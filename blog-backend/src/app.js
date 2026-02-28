const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes')
const postRoutes = require('./routes/postRoutes')
const cookieParser = require('cookie-parser')
const imagekitRoutes = require('./routes/imageKitRoutes')
const commentRoutes = require('./routes/commentRoutes')
const userRoutes = require('./routes/userRoutes')
const app = express();

const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    process.env.FRONTEND_URL,
].filter(Boolean)

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors({
    origin: allowedOrigins,
    credentials: true, // to allow cookies to be sent
}))
app.use(cookieParser())

// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Backend is running' });
});

app.get('/api', (req, res) => {
    res.status(200).json({ message: 'API is running' });
});

//routes
app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/comments', commentRoutes)
app.use('/api/imagekit', imagekitRoutes)

app.use('/api/users', userRoutes)
module.exports = app;