const User = require('../models/User');

async function createUser(email, username, hashedPassword) {
    const user = new User({
        email,
        username,
        hashedPassword,
    });
    return await user.save();
}

async function getUserByUsername(username) {
    return await User.findOne({ username: { $regex: username, $options: 'i' } }).populate('bookedHotels');
}
async function getUserByEmail(email) {
    return await User.findOne({ email: { $regex: email, $options: 'i' } });
}

module.exports = {
    getUserByEmail,
    getUserByUsername,
    createUser
}