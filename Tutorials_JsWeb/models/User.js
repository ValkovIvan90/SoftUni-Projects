const mongoose = require('mongoose');



const schema = new mongoose.Schema({
    username: { type: String, required: true },
    hashedPassword: { type: String, required: true },
    courses: [{
        type: mongoose.Types.ObjectId, ref: 'Course'
    }]
});

module.exports = mongoose.model('User', schema);