const express = require('express')
const app = express()
const cors = require('cors')
const User = require('./models/User.js');
const Exercise = require('./models/Exercise.js');
const mongoose = require('mongoose');
var strftime = require('strftime');

require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URL,
  {
    useNewUrlParser: true,
  }
);


// Get all the users
app.get('/api/users', async (req, res) => {
  let user = await User.find();
  res.json(user);
});



// Create user
app.post('/api/users', async (req, res) => {
  const { username } = req.body;

  let user = await User.create({ username });
  res.json({ username: user.username, _id: user._id });
});


// Create exercise
app.post('/api/users/:_id/exercises', async (req, res) => {
  const { description, duration, date } = req.body;
  const { _id } = req.params;  // User Id

  // Find user
  let user = await User.findOne({ _id: _id });

  // Create the exercise
  let exercise = await Exercise.create(
    {
      username: user.username,
      description,
      duration,
      date
    });

  res.json(
    {
      _id: user._id,
      username: user.username,
      date: strftime('%a %b %d %Y', exercise.date),
      duration: exercise.duration,
      description: exercise.description
    });
});

// Get user's exercise log 
app.get('/api/users/:_id/logs', async (req, res) => {
  let { _id } = req.params;
  let { from, to, limit } = req.query;

  let user = await User.findOne({ _id: _id });

  const query = Exercise.find({
    username: user.username
  })

  if (limit) {
    query.limit(Number(limit));
  }
  if (from) {
    from = new Date(from)
    query.find({ date: { $gte: from } })
  }
  if (to) {
    to = new Date(to);
    query.find({ date: { $lt: to } })
  }

  const exercise = await Promise.all([
    Exercise.find(query).lean(),
  ]);

  let log = exercise[0].map((a) => {
    return {
      description: a.description,
      duration: a.duration,
      date: strftime('%a %b %d %Y', a.date),
    }
  })

  res.status(200).send(
    {
      username: user.username,
      count: log.length,
      _id: user._id,
      log
    });
})


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
