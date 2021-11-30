const mongoose = require('mongoose');
const { Schema } = mongoose;

const UrlSchema = new mongoose.Schema(
    {
        short_url: { type: Number },
        original_url: { type: String },
    }
);

module.exports = Url = mongoose.model('Url', UrlSchema);