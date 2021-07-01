function preloadCourse() {
    return async (req, res, next) => {
        req.data = req.data || {};
        try {
            const course = await req.storage.getById(req.params.id);
            if (course) {
                req.data.course = course
            }
        } catch (err) {
            console.error('Database error!', err.message);
        }
        next();
    };
};
module.exports = {
    preloadCourse
}