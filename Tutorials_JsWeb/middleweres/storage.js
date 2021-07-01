const productServices = require('../services/product');

async function init() {
    return (req, res, next) => {
        const storage = Object.assign({}, productServices);
        req.storage = storage;
        next()
    }
};
module.exports = init;