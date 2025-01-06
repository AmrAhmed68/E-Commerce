const Product = require('../models/products');
const Categories = require('../models/categories')
const Slider = require('../models/slider')
const User = require("../models/user.model");
const mongoose = require('mongoose');
const { error, log } = require('console');
const { console } = require('inspector');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllPhoto = async (req, res) => {
  try {
    const photo = await Slider.find();
    res.status(200).json(photo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removePhoto = async (req, res) => {
  const {id} = req.params
  try {
    const photo = await Slider.findByIdAndDelete(id);
    res.status(200).json(photo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Categories.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCartQuantity = async (req, res) => {
  const { userId } = req.params;
  const { productId, quantity } = req.body; 

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }
  if (quantity < 1) {
    return res.status(400).json({ error: 'Quantity must be at least 1' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const cartItem = user.cart.find((item) => item.productId.toString() === productId);
    if (!cartItem) {
      return res.status(404).json({ error: 'Product not found in cart' });
    }

    cartItem.quantity = quantity;

    await user.save();

    res.json({
      message: 'Cart updated successfully',
      cart: user.cart, // Return the updated cart
    });
  } catch (err) {
    console.error('Error updating cart:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.removeCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!user || !product) {
      return res.status(404).json({ message: 'User or Product not found' });
    }

    const productInCart = user.cart.find(item => item.productId.toString() === productId);

    if (!productInCart) {
      return res.status(400).json({ message: 'Product not found in cart' });
    }

    product.stock += productInCart.quantity;

    user.cart = user.cart.filter(item => item.productId.toString() !== productId);

    await product.save();
    await user.save();

    res.status(200).json({ message: 'Product removed from cart', cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: 'Error removing product from cart', error });
  }
};

exports.getCart = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate('cart.productId');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

exports.getCartId = async (req, res) => {
  const { userId, productId } = req.params;

  try {
    const user = await User.findById(userId).populate('cart.productId');

    const productInCart = user.cart.some(item => item.productId._id.toString() === productId);

    return res.status(200).json({ exists: productInCart }); 

  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

exports.addCart = async (req, res) => {
    try {
      const { userId } = req.params;
      const { productId, quantity } = req.body;  
      const product = await Product.findById(productId);
  
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      if (product.stock < quantity) {
        return res.status(400).json({ message: 'Not enough stock available' });
      }
  
      const user = await User.findById(userId);
      const existingProduct = user.cart.find(item => item.productId.toString() === productId);
  
      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        user.cart.push({ productId, quantity });
      }
        product.stock -= quantity;
  
      await product.save();
      await user.save();
  
      res.status(200).json({ message: 'Product added to cart', cart: user.cart });
    } catch (error) {
      console.error("Error adding to cart:", error); // Log the full error!
      res.status(500).json({ error: 'Internal Server Error' });    }
}

exports.getCategory = async (req ,res ) => {
  const { categoryName } = req.params;

  try {
    const products = await Product.find({
      category: categoryName,
    });
    
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error getting category:", error); 
    res.status(500).json({ error: error.message });
  }
}

exports.getSubCategory = async (req ,res ) => {
  const { categoryName, subcategoryName } = req.params;

  try {
    const products = await Product.find({
      category: categoryName,
      subcategory: subcategoryName,
    });
    
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error getting category:", error); 
    res.status(500).json({ error: error.message });
  }
}

exports.addFavourite = async(req ,res) => {
  try {
    const {userId} = req.params
    const {productId} = req.body
    const user = await User.findById(userId)
    const existingProduct = user.favourite.find(item => item.productId.toString() === productId)
    if (existingProduct) {
      return res.status(400).json({ message: 'Product already in favourite' })
      }
      user.favourite.push({ productId })
      await user.save()
      res.status(200).json({ message: 'Product added to favourite' })
      } catch (error) {
        res.status(500).json({ message: 'Error adding product to favourite', error })
        }
}

exports.removeFavourite = async(req , res) => {
  try {
    const {userId , productId} = req.params

    const user = await User.findById(userId)
    const product = await Product.findById(productId);

    if (!user || !product) {
      return res.status(404).json({ message: 'User or Product not found' });
    }
    
    const index = user.favourite.findIndex(item => item.productId.toString() === productId)

    if (index === -1) {
      return res.status(400).json({ message: 'Product not in favourite' })
      }
      user.favourite.splice(index, 1)
      await user.save()
      res.status(200).json({ message: 'Product removed from favourite' })
      } catch (error) {
        res.status(500).json({ message: 'Error removing product from favourite', error })
        }
}

exports.getFavouriteId = async (req, res) =>{
  const { userId, productId } = req.params;

  try {
    const user = await User.findById(userId).populate('favourite.productId');

    const productInFavourite = user.favourite.some(item => item.productId._id.toString() === productId);

    return res.status(200).json({ exists: productInFavourite }); 

  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

exports.getFavourite = async (req, res) =>{
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate('favourite.productId');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.favourite);
  } catch (error) {
    console.error('Error fetching favourite:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.addPhoto = async (req, res) => {
  const { image } = req.body;

  if (!image) {
    return res.status(400).json({ message: 'Image is required' });
  }
  
  try {
    const newPhoto = new Slider({image});
    const savedPhoto = await newPhoto.save();
    res.status(201).json([savedPhoto]);
  } catch (error) {
    console.error(error)
    res.status(400).json({ message: error.message });
  }
};

exports.addCategory = async (req, res) => {
  try {
    const newCategory = new Categories(req.body);
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({
      reviews: product.ratings.reviews,
      average: product.ratings.average,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching reviews", error: err.message });
  }
}

exports.reviews = async (req, res) => {
  try {
    const { userId , userName, comment, rating } = req.body;
    
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const existingReview = product.ratings.reviews.find(
      (review) => review.userId.toString() === userId.toString()
    );
  
    if (existingReview) {
      throw new Error('User has already reviewed this product.');
    }

    const review = { userId , userName, comment, rating, createdAt: new Date() };
    product.ratings.reviews.push(review);

    const totalRating = product.ratings.reviews.reduce((sum, review) => sum + review.rating, 0);
    product.ratings.average = totalRating / product.ratings.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added successfully", product });
  } catch (err) {
    console.error(error)
    res.status(500).json({ message: "Error adding review", error: err.message });
  }
}

exports.getSections = async (req , res) => {
  const { section } = req.params;
  console.error(section);

  try {
    const products = await Product.find({ section });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products by section" });
  }
}

exports.addTOSection = async (req , res) => {
  const { section  , productId} = req.body;

  try {
    const product = await Product.findByIdAndUpdate(
      productId,
      { section },
      { new: true }
    );
    res.status(200).json({ message: "Section updated", product });
  } catch (err) {
    res.status(500).json({ error: "Failed to update product section" });
  }
}
