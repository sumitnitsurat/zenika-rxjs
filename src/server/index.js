const express = require('express');

const app = express();

app.use(express.static('dist'));
app.listen(8080, () => console.log('Listening on port 8080!'));

const io = require('socket.io')();

io.on('connection', (client) => {
  client.on('subscribeToTimer', (interval) => {
    console.log('client is subscribing to timer with interval ', interval);
    setInterval(() => {
      client.emit('timer', { time: new Date(), value: Math.floor((Math.random() * 50) + 1)});
    }, interval);
  });

  client.on('disconnect', () => {
    // console.log('user disconnected');
});
});

const port = 8000;
io.listen(port);
console.log('listening on port ', port);
