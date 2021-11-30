require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const Url = require('./models/Url.js');
const mongoose = require('mongoose');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json())

mongoose.connect(process.env.MONGO_DB,
  {
    useNewUrlParser: true,
  }
);
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Post url
app.post('/api/shorturl', async (req, res) => {
  const { url } = req.body;
  console.log(url)

  var regex = new RegExp(/https:\/\//gi);

  if (url.match(regex)) {
    let short_url = Math.floor(Math.random() * 100) + 1;
    console.log("short_url: ", short_url)
    await Url.create({ short_url, original_url: url });
    res.json({ original_url: url, short_url });
  } else {
    res.json({ error: 'invalid url' });
  }

});


// Get url
app.get('/api/shorturl/:id?', async (req, res) => {
  let param = req.params.id;
  const url = await Url.findOne({ short_url: param });

  res.writeHead(302, {
    location: url.original_url
  });
  res.end();
});

app.listen(3000, function () {
  console.log(`Listening on port ${port}`);
});
