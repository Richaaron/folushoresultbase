const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send({ error: 'Invalid login credentials' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.send({ 
      user: { 
        id: user.id, 
        username: user.username, 
        fullName: user.fullName, 
        role: user.role,
        isFormTeacher: user.isFormTeacher,
        isSubjectTeacher: user.isSubjectTeacher
      }, 
      token 
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
