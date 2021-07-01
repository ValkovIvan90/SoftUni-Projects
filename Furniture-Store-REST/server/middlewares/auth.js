const { SECRET } = require('../config')
const jtw = require('jsonwebtoken');

module.exports = () => (req, res, next) => {
    const token = req.headers['x-authorization'];

    try {
        if (token) {
            const userData = jtw.verify(token, SECRET);
            req.user = userData;
        }
    } catch (err) {
        console.log(err.message);
        //res.status(401).json({ message: 'Invalid acces token:Please sign in.' });
    }
    next();
}