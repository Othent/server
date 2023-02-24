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
  const txn_id = uploadFileToArweave('./file.png', 'img/png')
  res.json({ Tate: txn_id });
});



const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
