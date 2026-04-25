const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const Result = require('../models/Result');
const Student = require('../models/Student');
const Subject = require('../models/Subject');

router.post('/', auth, authorize(['ADMIN', 'TEACHER']), async (req, res) => {
  try {
    const { studentId, subjectId, term, academicYear, testScore, examScore, remark } = req.body;
    
    const totalScore = (testScore || 0) + (examScore || 0);
    const calculateGrade = (total) => {
      if (total >= 75) return "A1";
      if (total >= 70) return "B2";
      if (total >= 65) return "B3";
      if (total >= 60) return "C4";
      if (total >= 55) return "C5";
      if (total >= 50) return "C6";
      if (total >= 45) return "D7";
      if (total >= 40) return "E8";
      return "F9";
    };

    const result = await Result.create({
      StudentId: studentId,
      SubjectId: subjectId,
      term,
      academicYear,
      testScore,
      examScore,
      totalScore,
      grade: calculateGrade(totalScore),
      remark
    });

    res.status(201).send(result);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/student/:studentId', auth, async (req, res) => {
  try {
    const { studentId } = req.params;
    
    // Check if parent is viewing their own child
    if (req.user.role === 'PARENT') {
      const student = await Student.findOne({ where: { id: studentId, parentId: req.user.id } });
      if (!student) return res.status(403).send({ error: 'Unauthorized access to student results' });
    }

    const results = await Result.findAll({ 
      where: { StudentId: studentId },
      include: [Subject]
    });
    res.send(results);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
