const mongoose = require('mongoose');
const urlSchema = new mongoose.Schema({

    full_url : String,
    short_url: String,
    count: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
});

const Url = mongoose.model("Url", urlSchema);

module.exports = Url;
