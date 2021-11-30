// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

var strftime = require('strftime');
// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/api/', (req, res) => {
  const date = new Date();

  return res.json({
    unix: date.getTime(),
    utc: strftime('%a, %d %b %Y %H:%M:%S GMT', date)
  });
});

app.get("/api/:date?", async (req, res) => {
  let param = req.params.date;
  let date = new Date();

  if (/^\d*$/.test(req.params.date)) {
    date.setTime(param);
  } else {
    date = new Date(param);
  }

  if (!date.getTime()) {
    res.send({ error: "Invalid Date" })
  }

  let utc = strftime('%a, %d %b %Y %H:%M:%S GMT', date);
  res.send({
    unix: date.getTime(),
    utc
  });

});

// listen for requests :)
var listener = app.listen(3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
