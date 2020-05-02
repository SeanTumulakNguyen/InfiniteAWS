const express = require('express');
require('dotenv').config()

const app = express();

// import routes
const authRoutes = require('./routes/auth')

// middlewares
app.use('/api', authRoutes)

const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(`API server is running on port ${port}`)
})