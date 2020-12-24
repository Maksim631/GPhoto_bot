const express = require('express');
const bot = require('./bot');

const app = express();
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/gphoto-bot', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

app.get('/auth/google/callback', (req, res) => {
  // { secret_code: req.query.code }
  res.sendFile('./view/index.html', { root: __dirname });
});

app.listen(8080, () => {
  console.log(`App listening!`);
})