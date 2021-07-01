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

        if (req.data.play && req.user && (req.data.play.authorId == req.user._id)) {
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