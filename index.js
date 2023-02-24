const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.json({ hello: 'world' });
});

const uploadFileToArweave = require('./upload.js')

app.post('/upload', (req, res) => {
  // Add your function call here
  const transactionId = uploadFileToArweave('./file.png', 'img/png')
  .then(transactionId => {
    res.json({ Tate: transactionId });
  })
  .catch(error => {
    res.json({ ERROR: 'error' });
  });
});



const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
