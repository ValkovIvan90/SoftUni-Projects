const productController = require('../controllers/productController');
const homeController = require('../controllers/homeController');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

module.exports = (app) => {
   app.use('/products', productController);
   app.use('/auth/', authController);
   app.use('/user/', userController);


   app.use('/', homeController);

   app.use('*', (req, res) => {
      res.render('404', { title: 'Not found page' });
   });
}