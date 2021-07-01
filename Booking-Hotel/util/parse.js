function parseMongooseErrors(error) {
    return Object.values(error.errors).map(e => e.properties.message);
};

module.exports = {
    parseMongooseErrors
}