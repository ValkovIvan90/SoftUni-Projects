const Trip = require('../models/Trip');

async function getAll() {
    // let sort = { createdAt: -1 };

    // if (orderBy == 'likes') {
    //     sort = { usersLiked: 'desc' };
    // }
    // const hotels = Hotel.find({}).sort(sort).lean();
    const trips = Trip.find({}).lean();
    return trips;
};

//get Trip by id!
async function getById(id) {
    const trip = await Trip.
        findById(id)
        .populate('buddies')
        .lean();

    if (trip) {
        const viewModel = {
            _id: trip._id,
            startPoint: trip.startPoint,
            endPoint: trip.endPoint,
            date: trip.date,
            time: trip.time,
            carImage: trip.carImage,
            brand: trip.brand,
            seats: trip.seats,
            price: trip.price,
            description: trip.description,
            buddies: trip.buddies,
            owner: trip.owner
        };
        return viewModel;

    } else {
        undefined;
    }
}
// create
async function createTrip(trip) {
    const record = new Trip(trip);
    return record.save();
}
//Edit
async function edit(id, trip) {
    const existingTrip = await Trip.findById(id);

    if (!existingTrip) {
        throw new ReferenceError('No such ID in database');
    };

    Object.assign(existingTrip, trip);
    return existingTrip.save();
};
//Delete
async function deleteTrip(tripId) {
    return await Trip.deleteOne({ _id: tripId });
}

module.exports = {
    getAll,
    createTrip,
    edit,
    deleteTrip,
    getById
}