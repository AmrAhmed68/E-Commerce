const express = require('express');
const Image = require('../models/logo');
const upload = require('../middleware/multer');

exports.getLogo = async (req, res) => {
  try {
    const logo = await Image.findOne().sort({ createdAt: -1 }); 

    if (!logo) {
      return res.status(404).json({ message: 'Logo not found' });
    }

    res.status(200).json(logo);
  } catch (error) {
    console.error('Error retrieving logo from database:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.uploadPhoto = async (req, res) => {
  const { imageUrl } = req.body; 

  if (!imageUrl) {
    return res.status(400).json({ message: 'No image URL provided' });
  }

  try {
    const newImage = new Image({
      imageUrl,
    });
    await newImage.save();

    res.status(201).json({ message: 'Logo URL saved successfully', photo: newImage });
  } catch (error) {
    console.error('Error saving logo URL to database:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
