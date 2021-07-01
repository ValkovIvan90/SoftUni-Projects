const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    startPoint: {
        type: String,
        required: [true, 'Trip startPoint is required!'],
    },
    endPoint: {
        type: String,
        required: [true, 'Trip endPoint is required!'],
    },
    date: {
        type: String,
        required: [true, 'Date is required!'],
    },
    time: {
        type: String,
        required: [true, 'Time is required!'],
    },
    carImage: {
        type: String, required: [true, 'Image is required!'],
        match: [/^https?:\/\//, 'Image UrL must be valid !']
    },
    brand: {
        type: String,
        required: [true, 'Brand is required!'],
    },
    seats: {
        type: Number,
        required: [true, 'Seats is required!'],
    },
    price: {
        type: Number,
        required: [true, 'Price is required!'],
    },
    description: {
        type: String,
        required: [true, 'Description is required!'],
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    buddies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Trip', hotelSchema);