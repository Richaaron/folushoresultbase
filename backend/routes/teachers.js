const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { auth, authorize } = require('../middleware/auth');
const User = require('../models/User');

// Register a new teacher (Admin only)
router.post('/register', auth, authorize(['ADMIN']), async (req, res) => {
  try {
    const { fullName, email, isFormTeacher, isSubjectTeacher } = req.body;

    // Generate username from full name (lowercase, no spaces) + random suffix
    const baseUsername = fullName.toLowerCase().replace(/\s+/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const username = `teacher_${baseUsername}${randomSuffix}`;

    // Generate random 8-character password
    const password = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(password, 8);

    const teacher = await User.create({
      username,
      password: hashedPassword,
      fullName,
      email,
      role: 'TEACHER',
      isFormTeacher: !!isFormTeacher,
      isSubjectTeacher: !!isSubjectTeacher
    });

    res.status(201).send({
      teacher: {
        id: teacher.id,
        username: teacher.username,
        fullName: teacher.fullName,
        role: teacher.role,
        isFormTeacher: teacher.isFormTeacher,
        isSubjectTeacher: teacher.isSubjectTeacher
      },
      credentials: {
        username,
        password
      }
    });
  } catch (error) {
    console.error('Teacher registration error:', error);
    res.status(400).send({ error: 'Failed to register teacher' });
  }
});

// Get all teachers (Admin only)
router.get('/', auth, authorize(['ADMIN']), async (req, res) => {
  try {
    const teachers = await User.findAll({
      where: { role: 'TEACHER' },
      attributes: ['id', 'username', 'fullName', 'isFormTeacher', 'isSubjectTeacher', 'createdAt']
    });
    res.send(teachers);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch teachers' });
  }
});

module.exports = router;
