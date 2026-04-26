const express = require('express');
const router = express.Router();
const Setting = require('../models/Setting');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { auth, authorize } = require('../middleware/auth');

// Get current settings
router.get('/', async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update settings
router.put('/', auth, authorize(['ADMIN']), async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create(req.body);
    } else {
      await settings.update(req.body);
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Change admin password
router.put('/change-password', auth, authorize(['ADMIN']), async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password incorrect' });
    }

    user.password = await bcrypt.hash(newPassword, 8);
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
