const express = require('express');
const handlebars = require('express-handlebars');

const cookieParser = require('cookie-parser');

const auth = require('../middleweres/auth')

module.exports = (app) => {
    app.engine('hbs', handlebars({
        extname: 'hbs'
    }));
    app.set('view engine', 'hbs');
    app.use('/static', express.static('static'));
    app.use(express.urlencoded({
        extended: false
    }));

    app.use(cookieParser());
    app.use(auth());

}