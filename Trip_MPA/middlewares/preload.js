function preloadTrip() {
    return async (req, res, next) => {
        req.data = req.data || {};
        try {
            const trip = await req.storage.getById(req.params.id);
            if (trip) {
                req.data.trip = trip
            }
        } catch (err) {
            console.error('Database error!', err.message);
        }
        next();
    };
};
module.exports = {
    preloadTrip
}