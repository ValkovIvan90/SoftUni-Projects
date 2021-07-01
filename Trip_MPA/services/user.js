const User = require('../models/User');

//CreateUser
async function createUser(email, hashedPassword, gender) {
    const user = new User({
        email,
        hashedPassword,
        gender
    });
    await user.save();

    return user;
};

//getUserByEmail
async function getUserByEmail(userEmail) {
    if (userEmail) {
        return await User.findOne({ email: userEmail });
    } else {
        return undefined;
    }
};

//getUserByUsername

module.exports = {
    createUser,
    getUserByEmail,
}