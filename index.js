const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const app = express();
const allowedOrigins = ['https://weavetransfer.com', 'http://localhost:3000'];
app.use(cors({
  origin: allowedOrigins
}));
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
const upload = multer();


// Home
app.get('/', (req, res) => {
  res.json({ hello: 'world' });
});


// File uploads only for weavetransfer
const uploadFileToArweave = require('./weavetransfer/upload.js');
app.post('/weavetransfer', upload.single('file'), (req, res) => {
  const file = req.file.buffer;
  const fileName = req.body.file_name;
  const fileType = req.body.file_type;
  const message = req.body.message;
  uploadFileToArweave(file, fileType, fileName, message)
    .then((transactionId) => {
      res.json({ success: true, transactionId });
    })
    .catch((error) => {
      res.status(500).json({ success: false, error: error.message });
    });
});





// Create auth user

// Send transaction



// Start up server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
