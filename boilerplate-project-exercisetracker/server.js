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

mongoose.connect(process.env.MONGO_URL,
  {
    useNewUrlParser: true,
  }
);
// Get all the users
app.get('/api/users', async (req, res) => {
  let user = await User.find({});
  res.json({ user });
});


// Create user
app.post('/api/users', async (req, res) => {
  const { username } = req.body;

  let user = await User.create({ username });
  if (username) {
    res.json({ username: user.username, _id: user._id });
  } else {
    res.status(400).json({ err: "There is no username" })
  }
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
  const { _id } = req.params;  // User Id
  // First find user
  let user = await User.findOne({ _id: _id });
  // Find exercise
  let exercise = await Exercise.find({ username: user.username });
  let log = [];
  for (let i = 0; i < exercise.length; i++) {
    log.push(exercise[i]);
  }

  let logs = log.map((a) => {
    return {
      description: a.description,
      duration: a.duration,
      date: strftime('%a %b %d %Y', a.date),
    }
  })

  res.status(200).send(
    {
      username: user.username,
      count: exercise.length,
      _id: user._id,
      logs
    });
})


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
