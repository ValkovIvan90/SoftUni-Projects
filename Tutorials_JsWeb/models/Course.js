const mongoose = require('mongoose');



const schema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Course name is required!'],
        minLength: 4
    },
    description:
    {
        type: String,
        required: [true, 'Description is required!'],
        minLength: 20
    },
    imageUrl:
    {
        type: String,
        required: [true, 'Image is required!'],
        match: [/^https?:\/\//, 'Image UrL must be valid !'],
    },
    duration: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    users: [{
        type: mongoose.Types.ObjectId, ref: 'User'
    }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }

});

module.exports = mongoose.model('Course', schema);