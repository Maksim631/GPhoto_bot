const express = require('express');
const logger = require('pino')();
const app = express();
const mongoose = require('mongoose');

const BotClass = require('./bot');
new BotClass(logger.child({ class: "TelegramBot" }));

mongoose.connect('mongodb://mongo:27017/gphoto-bot', {
  useNewUrlParser: true
}).then(() => logger.info('Successfully connected to DB'))
  .catch((e) => logger.error(`Error accured during connecting to Database. ${e}`));

app.get('/auth/google/callback', (req, res) => {
  res.sendFile('./view/index.html', { root: __dirname });
});

app.listen(3000, () => {
  logger.info('App successfully listening on port 3000');
})