const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { TOKEN_SECRET, COOKIE_NAME } = require('../config/config');

const userServices = require('../services/user');

module.exports = () => (req, res, next) => {
    req.auth = {
        register,
        login,
        logout
    };

    if (readToken(req)) {
        next();
    }

    async function register({ username, password, rePass }) {
        const existingUsername = await userServices.getUserByUsername(username);

        if (existingUsername) {
            throw new Error('Name is taken!');
        };

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userServices.createUser(username, hashedPassword);
        req.user = createToken(user);
    };
    async function login({ username, password }) {
        const user = await userServices.getUserByUsername(username);
        if (!user) {
            throw new Error('Wrong email or password');
        } else {
            const isMatch = await bcrypt.compare(password, user.hashedPassword);
            if (!isMatch) {
                throw new Error('Wrong email or password');
            } else {
                req.user = createToken(user);
            }
        }
    }
    //Logout
    async function logout() {
        res.clearCookie(COOKIE_NAME);
    }

    //Create Token
    function createToken(user) {
        const userViewModel = { _id: user._id, username: user.username };
        const token = jwt.sign(userViewModel, TOKEN_SECRET);
        res.cookie(COOKIE_NAME, token, { httpOnly: true });

        return userViewModel;
    };
    //ReadToken
    function readToken(req) {
        const token = req.cookies[COOKIE_NAME];

        if (token) {
            try {
                const userData = jwt.verify(token, TOKEN_SECRET);
                req.user = userData;
                res.locals.user = userData;
                console.log('User name is -', userData.username);
            } catch (err) {
                res.clearCookie(COOKIE_NAME);
                res.redirect('/auth/login');
                return false
            };
        };
        return true;
    };
}