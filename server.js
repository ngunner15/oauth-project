const express = require("express");
const fetch = require("node-fetch");
const path = require('path');
require("dotenv").config(); // add this line to use dotenv package
const app = express();

app.use(express.static('public'));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get("/success", (req, res) => {
  res.sendFile(path.join(__dirname, '/public/success.html'));
});

app.get("/error", (req, res) => {
  res.sendFile(path.join(__dirname, '/public/error.html'));
});


app.get("/login/github", (req, res) => {
  const url = `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=http://localhost:4000/login/github/callback`; // github oauth url
  res.redirect(url);
});

async function getAccessToken(code) {
  const res = await fetch("https://github.com/login/oauth/access_token", {
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
  return params.get("access_token");
}

async function getGithubUser(access_token) {
  const req = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `bearer ${access_token}`
    }
  });
  const data = await req.json();
  return data;
}

app.get("/login/github/callback", async (req, res) => {
  const code = req.query.code;
  const token = await getAccessToken(code);
  
  getGithubUser(token).then((data) => {
    //console.log(data);
    if (data.node_id === process.env.GITHUB_ID) {
      res.redirect('/success');
    } else {
      res.redirect('/error');
    }
  });

});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("Listening on http://localhost:" + PORT));
