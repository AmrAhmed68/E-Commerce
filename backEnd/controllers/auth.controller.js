const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const passport = require('passport'); 
const jwt = require('jsonwebtoken');


exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Authentication error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    if (!user) {
      console.log('Authentication failed:', info.message);
      return res.status(401).json({ message: info.message });
    }

    console.log('Authenticated user:', user); // Log the user object

    req.logIn(user, (err) => {
      if (err) {
        console.error('Login failed:', err);
        return res.status(500).json({ message: 'Login failed' });
      }
      console.log('Login successful');

      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin }, 
        'your_jwt_secret', 
        { expiresIn: '1h' }
      );

      return res.json({ 
        message: 'Logged in successfully',
        token: token,
        user: { username: user.username, isAdmin: user.isAdmin } ,
      });
    });
  })(req, res, next);
};

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: 'Unauthorized' });
};

exports.logout = (req, res) => {
  req.logout();
  res.json({ message: 'Logged out successfully' });
};

exports.register = async (req, res) => {
  const { username, email, password , retypePassword , age, phone, gender } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      retypePassword : hashedPassword,
      age,
      phone,
      gender
    });    
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); 
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUserProfile = async (req, res) => {
  const { username, email, phone } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.username = username || user.username;
    user.email = email || user.email;
    user.phone = phone || user.phone;

    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Error updating profile', error);
    res.status(500).json({ message: 'Server error' });
  }
};



