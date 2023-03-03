const express = require('express');
const cors = require('cors')
const uploadFileToArweave = require('./upload.js')
const bodyParser = require('body-parser');


const app = express();
app.use(cors({
  origin: 'http://localhost:3000' // website domain later
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



app.get('/', (req, res) => {
    res.json({ hello: 'world' });
});



// route to handle file uploads - show tate
app.post('/upload', (req, res) => {


    const body = req.body
    console.log('this is the body: ', body)
    
    const file = body.contents

    const headers = req.headers


    const file_type = headers.file_type

    const file_name = headers.file_name


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
