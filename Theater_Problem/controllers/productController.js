const router = require('express').Router();
const Play = require('../models/Play');
const serviceProduct = require('../services/product')
const { isOwner, isAuth } = require('../middlewares/guards');
const { preloadPlay } = require('../middlewares/preload');
const { parseMongooseError } = require('../util/parse');



// Home
router.get('/', async (req, res) => {
    const plays = await req.storage.getAll(req.query.orderBy);
    const ctx = {
        title: 'Home',
        plays,
    };
    res.render('home', ctx)
});

// Create
router.get('/create', isAuth(), async (req, res) => {
    res.render('theaterPages/create', { title: 'Create Play' })
});
router.post('/create', isAuth(), async (req, res) => {

    let { title, description, imageUrl, isPublic } = req.body;
    const playData = {
        title,
        description,
        imageUrl,
        isPublic: Boolean(isPublic),
        createdAt: new Date(),
        author: req.user._id
    };
    try {
        await req.storage.createPlay(playData);
        res.redirect('/');
    } catch (err) {
        const ctx = {
            title: 'Create Play',
            playData
        };
        if (err.name == 'ValidationError') {
            ctx.errors = parseMongooseError(err);
        } else {
            ctx.errors = [err.message]
        }
        res.render('theaterPages/create', ctx)
    };
});
// Details ! 
router.get('/details/:id', async (req, res) => {
    const play = await serviceProduct.getById(req.params.id);
    if (play != undefined) {
        const isOwnLike = play.usersLiked.find(x => x._id == req.user._id);
        play.isOwner = req.user && (play.authorId == req.user._id);

        isOwnLike ? play.isOwnLike = isOwnLike : false;
        res.render('theaterPages/details', play);
    } else {
        throw new Error('Error!')
    }

});

// Edit 
router.get('/edit/:id', preloadPlay(), isOwner(), async (req, res) => {
    const play = await req.storage.getById(req.params.id);
    if (play != undefined) {

        res.render('theaterPages/edit', play);
    } else {
        throw new Error('Error!')
    }
});
router.post('/edit/:id', preloadPlay(), isOwner(), async (req, res) => {

    let { title, description, imageUrl, isPublic } = req.body;

    let playData = {
        title,
        description,
        imageUrl,
        isPublic: Boolean(isPublic),
        createdAt: new Date()
    };
    try {
        await req.storage.edit(req.params.id, playData);
        res.redirect('/');
    } catch (err) {
        return console.log(err);
    };
});
//Delete
router.get('/delete/:id', preloadPlay(), isOwner(), async (req, res) => {
    try {
        const play = await req.storage.getById(req.params.id);
        if (play.authorId != req.user._id) {
            throw new Error('Cannot delete play you haven\'t created!')
        }
        res.render('theaterPages/deletePlay', play)
    } catch (err) {
        console.log(err.message);
        res.redirect('/products/details/' + req.params.id);
    }
});
router.post('/delete/:id', preloadPlay(), isOwner(), async (req, res) => {
    try {
        await req.storage.deletePlay(req.params.id);
        res.redirect('/');
    } catch (err) {
        return console.log(err.message);
    };
});
//Likes details
router.get('/details/:id/likes', async (req, res) => {
    const play = await Play.findById(req.params.id);
    if (!play) {
        throw new ReferenceError('No such ID in database');
    }
    const user = req.user;
    play.usersLiked.push({ user: user.username, _id: user._id });
    await play.save();

    res.redirect('/');
});


module.exports = router;
