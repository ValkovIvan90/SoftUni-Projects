const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String, required: [true, 'Email  is required!']
    },
    hashedPassword: { type: String, required: true },
    gender: { type: String, required: true },
    tripHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trip' }]
});

module.exports = mongoose.model('User', userSchema);