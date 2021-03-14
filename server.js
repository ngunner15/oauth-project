import express from 'express';
const app = express();

app.get('/', (req, res) => {
  res.send('Oauth Project')
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Listening on http://localhost:' + PORT));
