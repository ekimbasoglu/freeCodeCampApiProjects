const mongoose = require('mongoose');
const { Schema } = mongoose;

const ExerciseSchema = new mongoose.Schema(
    {
        username: { type: String, required: true },
        duration: { type: Number, required: true },
        description: { type: String, required: true },
        date: { type: Date, default: new Date() }
    }
);

module.exports = Exercise = mongoose.model('Exercise', ExerciseSchema);