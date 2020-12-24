const express = require('express');
const bot = require('./bot');

const app = express();

app.get('/auth/google/callback', (req, res) => {
  // { secret_code: req.query.code }
  res.sendFile('./view/index.html', {root: __dirname });
});
app.listen(8080, () => {
  console.log(`App listening!`);
})