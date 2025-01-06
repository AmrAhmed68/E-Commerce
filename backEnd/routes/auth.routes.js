const express = require("express");
const routers = express.Router();
const passport = require("passport");
const authController = require("../controllers/auth.controller");
const productController = require("../controllers/product.controller");
const {ensureAuthenticated,ensureAdmin} = require("../middleware/adminCheck");
const authenticateToken = require("../middleware/auth");
const upload = require("../middleware/multer");

// User

routers.get("/users/:id", authenticateToken, authController.getUserById);
routers.get("/photo/:id", authController.getUserPhoto);
routers.post("/register", authController.register);
routers.post("/checkUnique", authController.checkUniqueFields);
routers.post("/login", passport.authenticate("local"), authController.login);
routers.post("/photo/:id",upload.single("profilePhoto"),authController.uploadPhoto);
routers.put("/updateProfile/:id",authenticateToken,authController.updateUserProfile);

// Product Routes
routers.get("/products", productController.getAllProducts);
routers.get("/categories", productController.getAllCategories);
routers.get("/subcategory/:categoryName/:subcategoryName", productController.getSubCategory);
routers.get("/subcategory/:categoryName", productController.getCategory);
routers.get("/products/:id", productController.getProductById);
routers.post('/:productId/reviews',productController.reviews);
routers.get('/:productId/reviews',productController.getReviews);
routers.post("/products",ensureAuthenticated,ensureAdmin,productController.addProduct);
routers.post("/slider",ensureAuthenticated,ensureAdmin,productController.addPhoto);
routers.delete("/slider/:id",ensureAuthenticated,ensureAdmin,productController.removePhoto);
routers.get("/slider", productController.getAllPhoto);
routers.get("/section/:section", productController.getSections);
routers.put("/section",ensureAuthenticated,ensureAdmin , productController.addTOSection);
routers.post("/categories",ensureAuthenticated,ensureAdmin ,productController.addCategory);
routers.put("/products/:id",ensureAuthenticated,ensureAdmin,productController.updateProduct);
routers.delete("/products/:id",ensureAuthenticated,ensureAdmin,productController.deleteProduct);

routers.get("/favourite/:userId", productController.getFavourite);
routers.get("/:userId/favourite/:productId", productController.getFavouriteId);
routers.post("/favourite/:userId",productController.addFavourite);
routers.delete("/favourite/:userId/:productId",productController.removeFavourite);

routers.post("/:userId/cart", productController.addCart);
routers.put('/:userId/cart', productController.updateCartQuantity);
routers.get("/:userId/cart", productController.getCart);
routers.get("/:userId/cart/:productId", productController.getCartId);
routers.delete("/:userId/cart/:productId", productController.removeCart);

module.exports = routers;
