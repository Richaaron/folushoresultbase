const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { auth } = require("../middleware/auth");

router.post("/login", async (req, res) => {
  try {
    console.log(`[Login] Full req.body:`, JSON.stringify(req.body));
    console.log(`[Login] Content-Type:`, req.headers['content-type']);
    const { username, password } = req.body;
    console.log(`[Login] Attempting login for username: ${username}`);
    
    const user = await User.findOne({ where: { username } });
    
    if (!user) {
      console.log(`[Login] User not found: ${username}`);
      return res.status(401).send({ error: "Invalid login credentials" });
    }
    
    console.log(`[Login] User found: ${username}, role: ${user.role}`);
    console.log(`[Login] Stored password hash: ${user.password.substring(0, 20)}...`);
    console.log(`[Login] Comparing with password: ${password}`);
    
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log(`[Login] Password match result: ${passwordMatch}`);
    
    if (!passwordMatch) {
      console.log(`[Login] Password mismatch for user: ${username}`);
      return res.status(401).send({ error: "Invalid login credentials" });
    }

    if (!process.env.JWT_SECRET) {
      console.error('[Login] JWT_SECRET is not set!');
      return res.status(500).send({ error: "Server configuration error: JWT_SECRET not set" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });
    res.send({
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isFormTeacher: user.isFormTeacher,
        isSubjectTeacher: user.isSubjectTeacher,
        assignedClass: user.assignedClass,
        assignedSubject: user.assignedSubject,
        profileImage: user.profileImage,
      },
      token,
    });
  } catch (error) {
    console.error('[Login] Error during login:', error.message);
    res.status(400).send({ error: error.message || "Login failed" });
  }
});

router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).send({ error: "User not found" });

    res.send({
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isFormTeacher: user.isFormTeacher,
      isSubjectTeacher: user.isSubjectTeacher,
      assignedClass: user.assignedClass,
      assignedSubject: user.assignedSubject,
      profileImage: user.profileImage,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
