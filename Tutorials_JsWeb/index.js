const express = require('express');
const { PORT } = require('./config/config')

const expressConfig = require('./config/express');
const databaseConfig = require('./config/database');
const routesConfig = require('./config/routes');

const logger = require('./middleweres/logger');
const storage = require('./middleweres/storage');



start();
async function start() {
    const app = express();
       
    app.use(logger());

    await databaseConfig(app);
    expressConfig(app);

    app.use(await storage());
    routesConfig(app);
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}...`));
};