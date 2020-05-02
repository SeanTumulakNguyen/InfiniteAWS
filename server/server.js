const express = require('express');
require('dotenv').config()

const app = express();

app.get('/api/register', (req, res) => {
	res.json({
		data: 'you hit the register endpoint'
	});
});

const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(`API server is running on port ${port}`)
})