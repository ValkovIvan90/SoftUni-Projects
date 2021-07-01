const mongoose = require('mongoose');



const schema = new mongoose.Schema({
    username: { type: String, required: true },
    hashedPassword: { type: String, required: true },
    likedPlays: [{
        type: mongoose.Types.ObjectId, ref: 'Play'
    }]
});

module.exports = mongoose.model('User', schema);