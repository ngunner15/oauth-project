const express = require('express');
const app = express();
require('dotenv').config(); // add this line to use dotenv package

app.get('/', (req, res) => {
  res.send('Practice Project oauth')
});

app.get('/login/github', (req, res) => {
  const url = `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=http://localhost:4000/login/github/callback`; // github oauth url
  res.redirect(url);
});

app.get('/login/github/callback', (req, res) => {});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Listening on http://localhost:' + PORT));
