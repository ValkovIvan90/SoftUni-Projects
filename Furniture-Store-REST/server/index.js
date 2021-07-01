const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const furnitureController = require('./controllers/furnitureController');
const userController = require('./controllers/userController');
const auth = require('./middlewares/auth');


start()
async function start() {

    await new Promise((resolve, reject) => {
        mongoose.connect('mongodb://localhost:27017/furniture-rest', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const db = mongoose.connection;
        db.once('open', () => {
            console.log('Database connected');
            resolve();
        });
        db.on('error', (err) => reject(err))
    })

    const app = express();

    
    app.use(cors());
    app.use(auth());
    app.use(express.json());//parse json data


    app.use('/data/catalog', furnitureController);
    app.use('/users', userController);

    app.listen(5000, () => console.log('REST Service is running on port 5000....'));
}