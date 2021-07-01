const router = require('express').Router();
const { body, validationResult } = require('express-validator');

//register 

router.get('/register', (req, res) => {
    res.render('register', { title: 'Register User' })
});

router.post('/register',
    body('email').trim().normalizeEmail().isEmail().withMessage('Invalid email address!'),
    body('password', 'Password must be at least 4 characters long and may contains only alphanumeric characters').trim().isLength({ min: 4 }).isAlphanumeric(),
    body('rePassword').trim().custom((value, { req }) => {
        if (value != req.body.password) {
            throw new Error('Password don\'t match!')
        }
        return true;
    })
    , async (req, res) => {
        try {
            const errors = Object.values(validationResult(req).mapped());
            if (errors.length > 0) {
                throw new Error(errors.map(e => e.msg).join('\n'));
            };
            await req.auth.register(req.body);
            res.redirect('/products')
        } catch (err) {
            const ctx = {
                title: 'Register',
                errors: err.message.split('\n'),
                data: {
                    email: req.body.email,
                }
            };
            res.render('register', ctx);
        };
    });

// Login ! 
router.get('/login', (req, res) => {
    res.render('login', { title: 'Login' })
});

router.post('/login', async (req, res) => {
    try {
        await req.auth.login(req.body);
        res.redirect('/products')
    } catch (err) {
        const ctx = {
            title: 'Login',
            errors: [err],
            data: { email: req.body.email }
        };
        res.render('login', ctx)
    };
});

router.get('/logout', (req, res) => {
    req.auth.logout();
    res.redirect('/products')
})
module.exports = router;