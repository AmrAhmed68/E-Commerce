const express = require('express');
const routers = express.Router();
const passport = require('passport');
const authController = require('../controllers/auth.controller');
const logoController = require('../controllers/logo.controller');
const productController = require('../controllers/product.controller');
const photoController = require('../controllers/photo.controller'); 
const { ensureAuthenticated, ensureAdmin } = require('../middleware/adminCheck');
const authenticateToken = require('../middleware/auth');
const upload = require('../middleware/multer');

routers.post('/signup', authController.register);
routers.post('/login', passport.authenticate('local'), authController.login);
routers.put('/updateProfile',authenticateToken,  authController.updateUserProfile);
routers.get('/getProfile',authenticateToken,  authController.getUserProfile);
routers.get('/users/:id', authenticateToken, authController.getUserById); 
routers.post('/logout', authController.logout);
routers.get('/dashboard', authController.isLoggedIn , (req, res) => {
    res.json({ message: 'Welcome to the dashboard', user: req.user });
  });


// Product Routes
routers.get('/products', productController.getAllProducts);
routers.get('/product', productController.getProducts);
routers.get('/products/:id', productController.getProductById);
routers.post('/products', ensureAuthenticated, ensureAdmin, productController.addProduct);
routers.post('/card' , productController.card);
routers.put('/products/:id', ensureAuthenticated, ensureAdmin, productController.updateProduct);
routers.delete('/products/:id', ensureAuthenticated, ensureAdmin, productController.deleteProduct);

routers.get('/photos', photoController.getAllPhotos);
routers.post('/photos', photoController.uploadPhoto);


routers.post('/uploads', ensureAuthenticated, ensureAdmin  , upload.single('Image'),logoController.uploadPhoto)
routers.get('/logo', logoController.getLogo);


module.exports = routers;
