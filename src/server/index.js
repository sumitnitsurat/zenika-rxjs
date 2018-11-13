const express = require('express');
const os = require('os');

const app = express();

app.use(express.static('dist'));
app.get('/api/getRandomNumber', (req, res) => res.send({ randomNumber: Math.floor((Math.random() * 100) + 1)}));
app.listen(8080, () => console.log('Listening on port 8080!'));
