const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes')
const postRoutes = require('./routes/postRoutes')
const cookieParser = require('cookie-parser')
const app = express();


// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors())
app.use(cookieParser())

// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });

//routes
app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)

module.exports = app;