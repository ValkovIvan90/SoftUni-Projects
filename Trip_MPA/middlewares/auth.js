const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { COOKIE_NAME, TOKEN_SECRET } = require('../config/config');

const { getUserByEmail, createUser } = require('../services/user');

module.exports = () => (req, res, next) => {
    req.auth = {
        register,
        login,
        logout
    };

    if (readToken(req)) {
        next();
    }
    //register
    async function register({ email, password, gender }) {
        login
        const existingEmail = await getUserByEmail(email);

        if (existingEmail) {
            throw new Error('Email is taken!');
        };

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await createUser(email, hashedPassword, gender);
        req.user = createToken(user);
    };

    //Login middleware!

    async function login({ email, password }) {

        const user = await getUserByEmail(email);
        if (!user) {
            throw new Error('Wrong username or Password!');
        } else {
            const isMatch = await bcrypt.compare(password, user.hashedPassword);
            if (!isMatch) {
                throw new Error('Wrong username or Password!')
            } else {
                req.user = createToken(user);
            };
        };
    };

    //logout

    async function logout() {
        res.clearCookie(COOKIE_NAME);
    }

    //createToken!
    function createToken(user) {
        const userViewModel = { _id: user._id, email: user.email };
        const token = jwt.sign(userViewModel, TOKEN_SECRET);
        res.cookie(COOKIE_NAME, token, { htppOnly: true });

        return userViewModel;
    }

    //readToken!!
    function readToken(req) {
        const token = req.cookies[COOKIE_NAME];

        if (token) {
            try {
                const userData = jwt.verify(token, TOKEN_SECRET);
                req.user = userData;
                res.locals.user = userData;
                console.log('Know user', userData.email);
            } catch (err) {
                res.clearCookie(COOKIE_NAME);
                res.redirect('/auth/login');
                return false;
            }
        };
        return true;
    }
}