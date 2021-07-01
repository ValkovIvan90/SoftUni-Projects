const { preloadHotel } = require('../middleweres/preload');
const { parseMongooseErrors } = require('../util/parse');
const { isAuth, isOwner } = require('../middleweres/guards');
const userServices = require('../services/user');

const router = require('express').Router();

const Hotel = require('../models/Hotel');


//Home

router.get('/', async (req, res) => {
    const hotels = await req.storage.getAll();
    const ctx = {
        title: 'Home',
        hotels,
    };
    res.render('home pages/home', ctx);

});

//Create
router.get('/create', isAuth(), async (req, res) => {

    res.render('booking/create', { title: 'Create' });
});
router.post('/create', isAuth(), async (req, res) => {

    const hotel = {
        name: req.body.hotel,
        city: req.body.city,
        imageUrl: req.body.imgUrl,
        rooms: req.body.rooms,
        owner: req.user._id
    };
    try {
        await req.storage.create(hotel);
        res.redirect('/products')
    } catch (err) {
        const ctx = {
            title: 'Create Hotel',
            hotel,
        };
        if (err.name == 'ValidationError') {
            ctx.errors = parseMongooseErrors(err);
        } else {
            ctx.errors = [err.message]
        };
        res.render('booking/create', ctx)
    }
});
//Details
router.get('/details/:id', isAuth(), preloadHotel(), async (req, res) => {

    try {
        const hotel = req.data.hotel;

        if (hotel == undefined) {
            throw new Error('No such Hotel in database!')
        };
        const userData = await userServices.getUserByEmail(req.user.email);

        hotel.isOwner = req.user && (hotel.owner == req.user._id);
        hotel.isCheked = Boolean(userData.bookedHotels.includes(req.params.id));
        
        const ctx = {
            title: 'Details',
            hotel
        };
        res.render('booking/details', ctx);
    } catch (err) {
        const ctx = {
            title: 'Details',
            errors: err.message.split('\n'),
        }
        res.render('booking/details', ctx);
    }
});
//Edit
router.get('/edit/:id', preloadHotel(), isOwner(), (req, res) => {
    try {
        const hotel = req.data.hotel;
        if (hotel == undefined) {
            throw new Error('No such Hotel in database!')
        };
        const ctx = {
            title: 'Edit',
            hotel
        }
        res.render('booking/edit', ctx);
    } catch (err) {
        const ctx = {
            title: 'Edit',
            errors: err.message.split('\n'),
        }
        res.render('booking/edit', ctx);
    };
});
router.post('/edit/:id', preloadHotel(), isOwner(), async (req, res) => {
    const data = req.body;
    const hotel = {
        name: data.name,
        city: data.city,
        rooms: data.rooms,
        imageUrl: data.imageUrl,
        owner: req.user._id
    };
    try {
        await req.storage.edit(req.params.id, hotel);
        res.redirect('/');
    } catch (err) {
        const ctx = {
            title: 'Edit',
            errors: err.message.split('\n'),
        }
        res.render('booking/edit', ctx)
    };

});
//Delete
router.get('/delete/:id', isOwner(), async (req, res) => {
    try {
        await req.storage.deleteHotel(req.params.id);
        res.redirect('/');
    } catch (err) {
        throw new Error(err.message)
    }
});
//Profile Page

router.get('/profile', async (req, res) => {
    const userData = await userServices.getUserByEmail(req.user.email);
    const ids = userData.bookedHotels;
    const records = await Hotel.find({ '_id': { $in: ids } });
    const names = records.map(e => e.name);

    const ctx = {
        title: 'Profile',
        records,
        names
    }

    res.render('user pages/profile', ctx)
});

//Booking

router.get('/details/:id/book', async (req, res) => {
    const user = await userServices.getUserByUsername(req.user.username);
    const hotel = await Hotel.findById(req.params.id);

    hotel.rooms -= 1;
    await hotel.save();

    user.bookedHotels.push(req.params.id);
    await user.save();
    res.redirect('/');
});

module.exports = router;