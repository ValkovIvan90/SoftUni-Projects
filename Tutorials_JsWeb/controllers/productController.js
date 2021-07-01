const router = require('express').Router();
const { parseMongooseError } = require('../util/parse');
const { isOwner, isAuth } = require('../middleweres/guards');
const { preloadCourse } = require('../middleweres/preload');
const Course = require('../models/Course');
const { getUserByUsername } = require('../services/user');



//Home

router.get('/', async (req, res) => {
    const courses = await req.storage.getAll(req.query.search);
    const ctx = {
        title: 'Home',
        courses

    }
    res.render('home/home', ctx);

});

//create
router.get('/create', isAuth(), async (req, res) => {
    res.render('course/create', { title: 'create' })
});
router.post('/create', isAuth(), async (req, res) => {
    let { title, description, imageUrl, duration } = req.body;
    const courseData = {
        title,
        description,
        imageUrl,
        duration,
        author: req.user._id
    }
    try {
        await req.storage.createCourse(courseData);
        res.redirect('/')
    } catch (err) {
        const ctx = {
            title: 'Create',
            courseData
        };

        if (err.name == 'ValidationError') {
            ctx.errors = parseMongooseError(err);
        } else {
            ctx.errors = [err.message]
        }
        res.render('course/create', ctx)
    }
});
// Details
router.get('/details/:id', isAuth(), async (req, res) => {
    const course = await req.storage.getById(req.params.id);
    if (course != undefined) {
        const isEnroll = course.users.find(x => x._id == req.user._id);
        course.isOwner = req.user && (course.author == req.user._id);

        isEnroll ? course.isEnroll = isEnroll : false;
        res.render('course/details', course);
    } else {
        throw new Error('Error!')
    }
});
//Edit
router.get('/edit/:id', preloadCourse(), isOwner(), async (req, res) => {
    const course = await req.storage.getById(req.params.id);
    if (course != undefined) {
        res.render('course/edit', course);
    } else {
        throw new Error('Error!')
    }

})
router.post('/edit/:id', preloadCourse(), isOwner(), async (req, res) => {
    let { title, description, imageUrl, duration } = req.body;
    const courseData = {
        title,
        description,
        imageUrl,
        duration,
        author: req.user._id
    }
    try {
        await req.storage.edit(req.params.id, courseData);
        res.redirect('/');
    } catch (err) {
        return console.log(err);
    };
});
//Delete
router.get('/delete/:id', preloadCourse(), isOwner(), async (req, res) => {

    try {
        await req.storage.deleteCourse(req.params.id);
        res.redirect('/');
    } catch (err) {
        return console.log(err.message);
    };
});

router.get('/enroll/:id', async (req, res) => {
    const user = await getUserByUsername(req.user.username);
    const course = await Course.findById(req.params.id);

    if (!course) {
        throw new ReferenceError('No such ID in database');
    };

    user.courses.push(course._id);
    course.users.push(user._id);


    await user.save();
    await course.save();

    res.redirect('/courses/details/' + req.params.id);
});

module.exports = router;