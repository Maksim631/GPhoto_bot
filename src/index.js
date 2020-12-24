const express = require('express');
const bot = require('./bot');

const app = express();
const mongoose = require('mongoose');

mongoose.connect('mongodb://mongo:27017/gphoto-bot', {
  useNewUrlParser: true
}).then(() => console.log('DB connected'))
  .catch(() => console.log('DB was not connected'));

app.get('/auth/google/callback', (req, res) => {
  // { secret_code: req.query.code }
  res.sendFile('./view/index.html', { root: __dirname });
});

app.listen(3000, () => {
  console.log(`App listening!!!!!`);
})