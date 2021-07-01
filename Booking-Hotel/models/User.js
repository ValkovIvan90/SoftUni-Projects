const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String, required: [true, 'Email  is required!']
    },
    username: { type: String, required: true },
    hashedPassword: { type: String, required: true },
    bookedHotels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' }],
    offerHotels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' }]
});

module.exports = mongoose.model('User', userSchema);