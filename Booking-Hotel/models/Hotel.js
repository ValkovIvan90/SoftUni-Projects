const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Hotel name is required!'],
        minLength: [4, 'The name should be at least 4 characters ']
    },
    city: {
        type: String,
        required: [true, 'City name is required!'],
        minLength: [3, 'The city should be at least 3 characters long ']
    },
    imageUrl: {
        type: String, required: [true, 'Image is required!'],
        match: [/^https?:\/\//, 'Image UrL must be valid !']
    },
    rooms: { type: Number, required: true, min: 1, max: 100 },
    userBookRoom: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    owner: { type: String, required: true }
});

module.exports = mongoose.model('Hotel', hotelSchema);