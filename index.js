const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const uploadFileToArweave = require('./upload.js');

const app = express();
const allowedOrigins = ['https://weavetransfer.com', 'http://localhost:3000'];
app.use(cors({
  origin: allowedOrigins
}));

app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
const upload = multer();

app.get('/', (req, res) => {
  res.json({ hello: 'world' });
});

// route to handle file uploads
app.post('/upload', upload.single('file'), (req, res) => {

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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
