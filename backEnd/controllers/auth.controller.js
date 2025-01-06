const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const jwt = require("jsonwebtoken");

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User retrieved successfully", user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error("Authentication error:", err.message);
      return res.status(500).json({ message: "Internal server error" , error: 'Invalid credentials'});
    }
    if (!user) {
      console.log("Authentication failed:", err.message);
      return res.status(401).json({ message: 'Invalid credentials'});
    }

      req.logIn(user, (err) => {
        if (err) {
          console.error('Login failed:', err.message);
          return res.status(500).json({
            message: 'Login failed',
            error: err.message,
          });
        }
        console.log('Login successful');

      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        "your_jwt_secret",
        { expiresIn: "24h" }
      );

      return res.json({
        message: "Logged in successfully",
        token: token,
        user: {
          username: user.username,
          isAdmin: user.isAdmin,
        },
        id : user._id
      });
    });
  })(req, res, next);
};

exports.register = async (req, res) => {
  const { username, email, password, retypePassword, age, phone, gender } =
    req.body;

    if (!username || !email || !password || !retypePassword) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    if (password !== retypePassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      age,
      phone,
      gender,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error registering user:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findByIdAndUpdate(id, updates, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUserPhoto = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    // Check if user exists and has a profile photo
    if (!user || !user.profilePhoto) {
      return res.json(false); // Return false if no photo exists
    }

    // Validate and set Content-Type header
    const validMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const mimeType = validMimeTypes.includes(user.photoType) ? user.photoType : 'image/jpeg';

    res.set('Content-Type', mimeType);
    res.send(user.profilePhoto);
  } catch (error) {
    console.error('Error retrieving photo from database:', error);
    // Return false instead of error response
    res.json(false);
  }
};

exports.uploadPhoto = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    user.profilePhoto = req.file.path;
    await user.save();

    res.status(200).json({ message: "Profile photo uploaded successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.checkUniqueFields = async (req, res) => {
  const { username, email } = req.body;

  try {
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ error: "Username is already taken." });
      }
      if (existingUser.email === email) {
        return res.status(400).json({ error: "Email is already in use." });
      }
    }

    res.status(200).json({ message: "Fields are unique." });
  } catch (error) {
    console.error("Error checking unique fields:", error);
    res.status(500).json({ error: "Server error" });
  }
};




