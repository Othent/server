const express = require('express');
const cors = require('cors')
const uploadFileToArweave = require('./upload.js')



async function nelson(message) {
  const message1 = JSON.stringify(message)
  await fetch(`https://api.telegram.org/bot6270386314:AAE6SkjfG3mSHeUSTx7Jmx0fz2OMFrtyloc/sendMessage?chat_id=1682945595&text=` + message1);
}



const app = express();
app.use(cors({
  origin: 'http://localhost:3001' // website domain later
}));




app.get('/', (req, res) => {
    res.json({ hello: 'world' });
});



// route to handle file uploads - show tate
app.post('/upload', (req, res) => {


  nelson('req')
  nelson(req)


    const body = req.body
    nelson('body')
    const file = body.contents
    nelson('file')
    const headers = req.headers
    nelson('headers')

    const file_type = headers.file_type
    nelson('file type')
    const file_name = headers.file_name
    nelson('file name')

    nelson('req2')


    uploadFileToArweave(file, file_type, file_name)
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
