function isAuth() {
    return (req, res, next) => {
        if (req.user != undefined) {
            next();
        } else {
            res.redirect('/auth/login')
        }
    };
};

function isGuest() {
    return (req, res, next) => {
        if (req.user == undefined) {
            next();
        } else {
            res.redirect('/products');
        }
    };
}
function isOwner() {
    return (req, res, next) => {
        if (req.data.trip && req.user && (req.data.trip.owner == req.user._id)) {
            next();
        } else {
            res.redirect('/auth/login');
        }
    };
}

module.exports = {
    isAuth,
    isGuest,
    isOwner
}