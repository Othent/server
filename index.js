const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());


app.get('/', (req, res) => {
    const orange = process.env.orange;
    res.json({ Tate: orange });
});



app.post('/upload', (req, res) => {
  // Add your function call here
  const orange = process.env.orange;
  res.json({ Tate: orange });
});



const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
