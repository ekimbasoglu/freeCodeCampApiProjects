const mongoose = require('mongoose');
const { Schema } = mongoose;

const UrlSchema = new mongoose.Schema(
    {
        number: { type: Number },
        url: { type: String },
    }
);

module.exports = Url = mongoose.model('Url', UrlSchema);