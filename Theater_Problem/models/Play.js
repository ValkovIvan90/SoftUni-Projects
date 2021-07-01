const mongoose = require('mongoose');

const playSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Play name is required!'],

    },
    description:
    {
        type: String,
        required: [true, 'Description is required!'],
        minLength: 20,
        maxLength: 500
    },
    imageUrl:
    {
        type: String,
        required: [true, 'Image is required!'],
        match: [/^https?:\/\//, 'Image UrL must be valid !'],
    },
    isPublic: { type: Boolean},
    createdAt: { type: Date, required: true },//Data.now
    usersLiked: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Play', playSchema);