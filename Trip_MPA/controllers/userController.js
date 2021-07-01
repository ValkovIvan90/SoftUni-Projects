const router = require('express').Router();
const { isAuth } = require('../middlewares/guards');
const userServices = require('../services/user');

const Trip = require('../models/Trip');


router.get('/profile', isAuth(), async (req, res) => {
    const userData = await userServices.getUserByEmail(req.user.email);

    const ids = userData.tripHistory;
    const records = await Trip.find({ '_id': { $in: ids } });

    const tripData = [];
    records.forEach(x => {
        tripData.push({ start: x.startPoint, end: x.endPoint, date: x.date, time: x.time });
    });

    const ctx = {
        title: 'Profile',
        counts: ids.length,
        tripData,
    }
    if (userData.gender == 'female') {
        ctx.gender = true
    }
    res.render('profile', ctx);
})

module.exports = router;