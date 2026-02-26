const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes')
const postRoutes = require('./routes/postRoutes')
const cookieParser = require('cookie-parser')
const imagekitRoutes = require('./routes/imageKitRoutes')
const commentRoutes = require('./routes/commentRoutes')
const app = express();


// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'], // Frontend URL
    credentials: true, // to allow cookies to be sent
}))
app.use(cookieParser())

app.use('/api/imagekit', imagekitRoutes)
// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });

//routes
app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/comments', commentRoutes)
app.use('/api/imagekit', imagekitRoutes)
module.exports = app;