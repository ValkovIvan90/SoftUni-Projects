const Play = require('../models/Play');

// get all plays
async function getAll(orderBy) {
    let sort = { createdAt: -1 };

    if (orderBy == 'likes') {
        sort = { usersLiked: 'desc' };
    }
    const plays = Play.find({}).sort(sort).lean();
    return plays;
}
//get Play by id!
async function getById(id) {
    const play = await Play.
        findById(id)
        .populate('usersLiked')
        .populate('author')
        .lean();

    if (play) {
        const viewModel = {
            _id: play._id,
            title: play.title,
            description: play.description,
            imageUrl: play.imageUrl,
            isPublic: Boolean(play.isPublic),
            author: play.author && play.author.username,
            usersLiked: play.usersLiked,
            authorId: play.author && play.author._id
        };
        return viewModel;

    } else {
        undefined;
    }
}
// create
async function createPlay(play) {
    const record = new Play(play);
    return record.save();
}
async function edit(id, play) {
    const existingPlay = await Play.findById(id);

    if (!existingPlay) {
        throw new ReferenceError('No such ID in database');
    };

    Object.assign(existingPlay, play);
    return existingPlay.save();
};
async function deletePlay(playId) {
    return await Play.deleteOne({ _id: playId });
}

module.exports = {
    getAll,
    createPlay,
    edit,
    deletePlay,
    getById
}