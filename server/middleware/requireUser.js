const mongoose = require('mongoose');
const User = require('../models/User');

// Basic authentication (Project 3): the client sends the logged-in user's id in the
// "x-user-id" header. We confirm that user exists before allowing write operations.
// NOTE: this is not tamper-proof. JWT (Project 4 bonus) is the proper fix.
const requireUser = async (req, res, next) => {
  try {
    const id = req.header('x-user-id');
    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(401).json({ message: 'Please log in to continue' });
    }
    const user = await User.findById(id);
    if (!user) return res.status(401).json({ message: 'Please log in to continue' });
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = requireUser;
