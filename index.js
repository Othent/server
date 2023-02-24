const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.json({ hello: 'world' });
});

const uploadFileToArweave = require('./upload.js')

// Define a route to handle file uploads
app.post('/upload', (req, res) => {
    const { name, data } = req.body;
    const buffer = Buffer.from(data, 'base64');
  
    // Call the uploadFileToArweave function with the specified buffer and content type
    uploadFileToArweave(buffer, 'image/png')
      .then(transactionId => {
        res.json({ success: true, transactionId });
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
      });
  });



const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
