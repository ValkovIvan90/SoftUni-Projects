const Hotel = require('../models/Hotel');

//get all hotels

async function getAll() {
    const hotels = await Hotel.find({}).lean();
    return hotels;
};
async function getById(id) {
    const hotel = await Hotel
        .findById(id)
        .populate('userBookRoom')
        .lean();
    if (hotel) {
        const viewModel = {
            _id: hotel._id,
            name: hotel.name,
            city: hotel.city,
            imageUrl: hotel.imageUrl,
            rooms: hotel.rooms,
            userBookRoom: [],
            owner: hotel.owner
        };
        return viewModel;
    } else {
        undefined;
    }
}
//Create
async function create(hotel) {
    const record = new Hotel(hotel);
    return record.save();
};
//Edit
async function edit(id, hotel) {
    const existing = await Hotel.findById(id);
    if (!existing) {
        throw new ReferenceError('No such ID in database!');
    };
    Object.assign(existing, hotel);
    return existing.save();
};
//Delete 
async function deleteHotel(id) {
    return await Hotel.findByIdAndDelete(id);
}

module.exports = {
    getAll,
    create,
    getById,
    edit,
    deleteHotel
}
