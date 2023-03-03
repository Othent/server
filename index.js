const express = require('express');
const cors = require('cors')
const multer = require('multer')
const uploadFileToArweave = require('./upload.js')

async function nelson(message) {
  const message1 = JSON.stringify(message)
  await fetch(`https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_TOKEN>/sendMessage?chat_id=<YOUR_CHAT_ID>&text=` + message1);
}

const app = express();
app.use(cors())

// configure multer middleware
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});

app.get('/', (req, res) => {
  res.json({ hello: 'world' });
});

// route to handle file uploads
app.post('/upload', upload.single('file'), (req, res) => {
  // extract file data from the request object
  const file = req.file.buffer;
  const fileType = req.body.file_type;
  const fileName = req.body.file_name;

  nelson('file received: ' + fileName);

  // upload file to Arweave
  uploadFileToArweave(file, fileType, fileName)
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
