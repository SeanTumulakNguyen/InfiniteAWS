const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();

// db
mongoose
	.connect(process.env.DATABASE_CLOUD, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
	.then(() => console.log('DB CONNECTED'))
	.catch((err) => console.log('err'));

mongoose.set('useCreateIndex', true);

// import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');

// app middlewares
app.use(morgan('dev'));
// app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '5mb', type: 'application/json' }));
// app.use(cors());

app.use(cors({ origin: process.env.CLIENT_URL }));

// middlewares
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);

const port = process.env.PORT || 8000;

app.listen(port, () => {
	console.log(`API server is running on port ${port}`);
});
