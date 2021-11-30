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

mongoose.connect(process.env.MONGO_URL,
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

  if (!url) {
    res.status(401).send({ error: 'Missing url!' })
  }

  var expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
  var regex = new RegExp(expression);

  if (!url.match(regex)) {
    res.status(401).send({ error: 'invalid url' });
  }
  const number = Math.floor(Math.random() * 100) + 1;

  const checkUrl = await Url.findOne({ number });
  if (checkUrl) {
    res.status(401).send({ error: 'invalid url' });
  };

  if (!checkUrl && url.match(regex)) {
    await Url.create({ number, url });
    res.json({ original_url: url, short_url: number });
  }

});

// Get url
app.get('/api/:id?', async (req, res) => {
  let param = req.params.id;
  const url = await Url.findOne({ number: param });

  if (url == 'null') {
    res.status(400).send({ error: 'There is no url found' })
  }

  res.writeHead(302, {
    location: url.url
  });
  res.end();
});

app.listen(3000, function () {
  console.log(`Listening on port ${port}`);
});

