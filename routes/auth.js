const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { auth, adminAuth } = require('../middlewares/auth');

const router = new express.Router();

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET );
  res.redirect(`/login/success?token=${token}`);
});


router.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = jwt.sign({ _id: user._id },process.env.JWT_SECRET );
    console.log('Registered user:', user);
    res.status(201).send({ user, token });
  } catch (error) {
    console.log('Registration error:', error.message);
    res.status(400).send(error);
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      console.log('User not found');
      throw new Error('Invalid login credentials');
    }

    const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordMatch) {
      console.log('Password mismatch');
      throw new Error('Invalid login credentials');
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET );
    res.send({ user, token });
  } catch (error) {
    console.log('Login error:', error.message);
    res.status(400).send({ error: 'Invalid login credentials' });
  }
});


router.get('/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/me', auth, async (req, res) => {
  res.send(req.user);
});

router.patch('/me', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'photo', 'bio', 'phone', 'email', 'password', 'isPublic'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    updates.forEach(update => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/profiles', auth, async (req, res) => {
  try {
    let users;
    if (req.user.isAdmin) {
      users = await User.find({});
    } else {
      users = await User.find({ isPublic: true });
    }
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/admin/users', auth, adminAuth, async (req, res) => {
    try {
      const users = await User.find({});
      res.send(users);
    } catch (error) {
      res.status(500).send(error);
    }
  });

module.exports = router;
