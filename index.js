const express = require('express');
const bot = require('./bot');

const app = express();

app.get('/auth/google/callback', (req, res) => {
  res.json({ secret_code: req.query.code })
});
app.listen(8080, () => {
  console.log(`App listening!`);
})