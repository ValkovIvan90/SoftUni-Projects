function preloadHotel() {
    return async (req, res, next) => {
        req.data = req.data || {};
        try {
            const hotel = await req.storage.getById(req.params.id);
            if (hotel) {
                req.data.hotel = hotel
            };
        } catch (err) {
            console.log('Database error', err.message);
        };
        next();
    };
};

module.exports = {
    preloadHotel
};