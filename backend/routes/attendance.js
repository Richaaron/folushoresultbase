const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

router.post('/', auth, authorize(['ADMIN', 'TEACHER']), async (req, res) => {
  try {
    const { studentId, date, status } = req.body;
    const attendance = await Attendance.create({
      StudentId: studentId,
      date,
      status
    });
    res.status(201).send(attendance);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/student/:studentId', auth, async (req, res) => {
  try {
    const { studentId } = req.params;

    if (req.user.role === 'PARENT') {
      const student = await Student.findOne({ where: { id: studentId, parentId: req.user.id } });
      if (!student) return res.status(403).send({ error: 'Unauthorized access' });
    }

    const attendance = await Attendance.findAll({ where: { StudentId: studentId } });
    res.send(attendance);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
