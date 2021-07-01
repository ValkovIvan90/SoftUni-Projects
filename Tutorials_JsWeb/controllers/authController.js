const router = require('express').Router();
const { body, validationResult } = require('express-validator');

const { isAuth } = require('../middleweres/guards');



//register

router.get('/register', (req, res) => {
    res.render('user/register', { title: 'Register' });
});
router.post('/register',
    body('username', 'Username must be at least 5 characters long and may contains only alphanumeric characters').trim().isLength({ min: 5 }).isAlphanumeric(),
    body('password', 'Password must be at least 5 characters long and may contains only alphanumeric characters').trim().isLength({ min: 5 }).isAlphanumeric(),
    body('rePassword').trim().custom((value, { req }) => {
        if (value != req.body.password) {
            throw new Error('Password dont\'t match!')
        };
        return true;
    }),
    async (req, res) => {
        try {
            const errors = Object.values(validationResult(req).mapped());
            if (errors.length > 0) {
                throw new Error(errors.map(e => e.msg).join('\n'));
            };
            await req.auth.register(req.body);
            res.redirect('/courses');
        } catch (err) {
            const ctx = {
                title: 'Register',
                errors: err.message.split('\n'),
                data: { username: req.body.username },
            };
            res.render('user/register', ctx);
        }
    });


//Login 

router.get('/login', (req, res) => {
    res.render('user/login', { title: 'Login' });
});
router.post('/login', async (req, res) => {
    try {
        await req.auth.login(req.body);
        res.redirect('/courses')
    } catch (err) {
        err = 'Username or password are invalid!'
        const ctx = {
            title: 'Login',
            errors: [err],
            data: { username: req.body.username }
        };
        res.render('user/login', ctx)
    };
});

//Logout

router.get('/logout', isAuth(), async (req, res) => {
    req.auth.logout();
    res.redirect('/courses')
})

module.exports = router;