const router = require('express').Router();
const { body, validationResult } = require('express-validator');

//register

router.get('/register', (req, res) => {
    res.render('user pages/register', { title: 'Register' });
});
router.post('/register',
    body('email', 'Invalid email address!').isEmail().normalizeEmail(),
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
            res.redirect('/products');
        } catch (err) {
            const ctx = {
                title: 'Register',
                errors: err.message.split('\n'),
                data: { username: req.body.username, email: req.body.email },
            };
            res.render('user pages/register', ctx);
        }
    });


//Login 

router.get('/login', (req, res) => {
    res.render('user pages/login', { title: 'Login' });
});
router.post('/login',
    body('email', 'Email or Password dont\'t match').isEmail().normalizeEmail().trim().bail(),
    body('password').trim().isAlphanumeric().bail(),

    async (req, res) => {
        const errors = Object.values(validationResult(req).mapped());
        try {
            if (errors.length > 0) {
                throw new Error(errors.map(e => e.msg).join('\n'));
            };
            await req.auth.login(req.body);
            res.redirect('/products')
        } catch (err) {
            const ctx = {
                title: 'Login',
                errors: err.message.split('\n'),
                data: { email: req.body.email }
            }
            res.render('user pages/login', ctx);
        }
    });

router.get('/logout', (req, res) => {
    req.auth.logout();
    res.redirect('/products');
})

module.exports = router;