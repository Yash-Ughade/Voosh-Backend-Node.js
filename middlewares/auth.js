const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Authorization header missing or invalid');
    }

    const token = authHeader.split(' ')[1];
    console.log('Received Token:', token);
    const decoded = jwt.verify(token, porocess.env.JWT_SECRET);
    console.log('Decoded Token:', decoded);
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });


    if (!user) {
      throw new Error('User not found');
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

const adminAuth = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).send({ error: 'Access denied.' });
  }
};

module.exports = { auth, adminAuth };
