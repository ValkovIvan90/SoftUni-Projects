const Furniture = require('../models/furniture');

async function getAll() {
    return Furniture.find({}).lean();
};
async function create(data) {
    const result = new Furniture(data);
    await result.save();
    return result;
};

async function getById(id) {
    return await Furniture.findById(id);
};
//Update
async function update(original, updated) {

    Object.assign(original, updated);

    await original.save();

    return original;
};
async function deleteFurniture(id) {
    return Furniture.findByIdAndDelete(id);
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    deleteFurniture
};