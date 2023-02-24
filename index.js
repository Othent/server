const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/upload', (req, res) => {
  console.log('Received POST request');
  // Add your function call here
  res.json({ Tate: 'Berenbaum' });
});

app.get('/', (req, res) => {
  res.json({ hello: 'world' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
