const router = require('express').Router();
const { getUserByEmail } = require('../services/user');
const { isOwner, isAuth } = require('../middlewares/guards');
const { preloadTrip } = require('../middlewares/preload');
const { parseMongooseError } = require('../util/parse');
const Trip = require('../models/Trip');
const User = require('../models/User');




// HomeUsers
router.get('/', async (req, res) => {
    res.render('home', { title: 'Home' })
});

//shared
router.get('/tripShared', async (req, res) => {
    const trips = await req.storage.getAll();
    const ctx = {
        title: 'Shared Trips',
        trips

    }
    res.render('shared', ctx)
});

// Create
router.get('/create', isAuth(), async (req, res) => {

    res.render('create', { title: 'Create Trip' })
});
router.post('/create', isAuth(), async (req, res) => {

    const trip = {
        startPoint: req.body.startPoint,
        endPoint: req.body.endPoint,
        date: req.body.date,
        time: req.body.time,
        carImage: req.body.carImage,
        brand: req.body.carBrand,
        seats: Number(req.body.seats) || '',
        price: Number(req.body.price) || '',
        description: req.body.description,
        owner: req.user._id,
        buddies: []
    };
    ;
    try {
        if (trip.seats == '' && trip.price == '') {
            throw new Error('Price and Seats fields must be valid numbers!')
        }
        await req.storage.createTrip(trip);
        res.redirect('/products/tripShared');
    } catch (err) {
        const ctx = {
            title: 'Create Trip',
            trip
        };
        if (err.name == 'ValidationError') {
            ctx.errors = parseMongooseError(err);
        } else {
            ctx.errors = [err.message]
        }
        res.render('create', ctx)
    };
});
// Details ! 
router.get('/details/:id', async (req, res) => {
    try {
        const trip = await req.storage.getById(req.params.id);

        if (trip == undefined) {
            throw new Error('No such Trip in database!')
        };

        if (req.user !== undefined) {
            const userData = await getUserByEmail(req.user.email);
            const tripOwner = await User.findById(trip.owner);

            trip.isOwner = req.user && (trip.owner == req.user._id);
            trip.isJoin = Boolean(userData.tripHistory.includes(req.params.id));
            trip.noSeats = Boolean(trip.seats <= 0);

            trip.email = tripOwner.email;
            trip.user = req.user;

            const ctx = {
                title: 'Details',
                trip
            };
            res.render('details', ctx);
        } else {
            const trip = await req.storage.getById(req.params.id);
            const tripOwner = await User.findById(trip.owner);

            trip.email = tripOwner.email;

            const ctx = {
                title: 'Details',
                trip
            };
            res.render('details', ctx);

        }
    } catch (err) {
        const ctx = {
            title: 'Details',
            errors: err.message.split('\n'),
        }
        res.render('details', ctx);
    }


});

// Edit 
router.get('/edit/:id', preloadTrip(), isOwner(), async (req, res) => {
    const trip = await req.storage.getById(req.params.id);
    if (trip != undefined) {
        const ctx = {
            title: 'Edit',
            trip
        }
        res.render('edit', ctx);
    } else {
        throw new Error('Error!')
    }
});
router.post('/edit/:id', preloadTrip(), isOwner(), async (req, res) => {
    const trip = {
        _id: req.params.id,
        startPoint: req.body.startPoint,
        endPoint: req.body.endPoint,
        date: req.body.date,
        time: req.body.time,
        carImage: req.body.carImage,
        brand: req.body.carBrand,
        seats: Number(req.body.seats) || '',
        price: Number(req.body.price) || '',
        description: req.body.description,
        owner: req.user._id,
        buddies: []
    };
    try {
        await req.storage.edit(req.params.id, trip);
        res.redirect('/products/tripShared');
    } catch (err) {
        const ctx = {
            title: 'Edit',
            trip
        };
        if (err.name == 'ValidationError') {
            ctx.errors = parseMongooseError(err);
        } else {
            ctx.errors = [err.message]
        }
        res.render('edit', ctx)

    };
});
//Delete


router.get('/delete/:id', preloadTrip(), isOwner(), async (req, res) => {
    try {
        await req.storage.deleteTrip(req.params.id);
        res.redirect('/products/tripShared');
    } catch (err) {
        throw new Error(err.message);
    }
});

//Join Trip
router.get('/details/:id/join', isAuth(), async (req, res) => {
    const user = await getUserByEmail(req.user.email);
    const trip = await Trip.findById(req.params.id);

    try {
        if (trip.seats <= 0) {
            throw new Error('Not enough seats!')
        }
        if (!trip.buddies.includes(req.user._id)) {
            trip.seats -= 1;
            trip.buddies.push(req.user._id);
            await trip.save();
            user.tripHistory.push(req.params.id);
            await user.save();
            res.redirect('/products/tripShared');
        } else {
            throw new Error('You have already joined!')
        }

    } catch (err) {
        const trip = await req.storage.getById(req.params.id);

        const ctx = {
            title: 'Details',
            trip
        };
        ctx.errors = [err.message]

        res.render('details', ctx)
    }
});


module.exports = router;
