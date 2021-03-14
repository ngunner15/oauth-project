const express = require('express');
const fetch = require('node-fetch');
const app = express();
require('dotenv').config(); // add this line to use dotenv package

app.get('/', (req, res) => {
  res.send('Practice Project oauth')
});

app.get('/login/github', (req, res) => {
  const url = `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=http://localhost:4000/login/github/callback`; // github oauth url
  res.redirect(url);
});

async function getAccessToken(code) {
  const res = await fetch('https://github.com/login/oauth/access_token', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code
    })
  });
  const data = await res.text();
  const params = new URLSearchParams(data);
  return params.get('access_token');
}

app.get('/login/github/callback', async (req, res) => {
  const code = req.query.code;
  const token = await getAccessToken(code);
  res.json({token});
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Listening on http://localhost:' + PORT));
