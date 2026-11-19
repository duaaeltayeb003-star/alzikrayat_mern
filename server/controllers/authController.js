const bcrypt = require('bcrypt');
const User = require('../models/User');

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const email = req.body.email.toLowerCase();
    if (await User.findOne({ email })) {
      return res.status(409).json({ message: 'This email is already registered' });
    }
    const password = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({ ...req.body, email, password });
    res.status(201).json(user); // toJSON removes the password hash
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email.toLowerCase() });
    const valid = user && (await bcrypt.compare(req.body.password, user.password));
    if (!valid) return res.status(401).json({ message: 'Invalid email or password' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};
