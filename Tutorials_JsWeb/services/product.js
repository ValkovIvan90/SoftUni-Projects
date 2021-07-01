const Course = require('../models/Course');

// get all plays
async function getAll(query) {
    let courses;
    if (query == undefined) {
        courses = await Course.find({}).lean();
    } else {
        courses = await Course.find({ title: { $regex: query, $options: 'i' } }).lean();
    };
    return courses;
};

//Create Course
async function createCourse(course) {
    const record = new Course(course);
    return await record.save();
}
//get By Id
async function getById(id) {
    const course = await Course.findById(id)
        .populate('users').lean();
    if (course) {
        const viewModel = {
            _id: course._id,
            title: course.title,
            description: course.description,
            imageUrl: course.imageUrl,
            duration: course.duration,
            users: course.users,
            author: course.author,
        };
        return viewModel;

    } else {
        undefined;
    }

};
//edit
async function edit(id, course) {
    const existing = await Course.findById(id);

    if (!existing) {
        throw new ReferenceError('No such ID in database');
    };

    Object.assign(existing, course);
    return existing.save();
}
//Delete
async function deleteCourse(courseId) {
    return await Course.deleteOne({ _id: courseId });
}
module.exports = {
    getAll,
    createCourse,
    getById,
    edit,
    deleteCourse
}