const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new mongoose.Schema(
    {
        username: { type: String, required: true },
    }
);

module.exports = User = mongoose.model('User', UserSchema);