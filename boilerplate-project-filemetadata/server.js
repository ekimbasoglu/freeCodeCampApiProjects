var express = require('express');
var cors = require('cors');
const multer = require('multer')
require('dotenv').config()
const { multerHandler } = require('./lib/multerHandler.js');


var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/fileanalyse', multerHandler('upfile'), async (req, res) => {
  const { originalname, mimetype, size } = req.file;

  res.status(200).send(
    {
      name: originalname,
      type: mimetype,
      size: size,
    })
});


const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
