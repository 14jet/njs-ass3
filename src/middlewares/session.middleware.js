const User = require("../models/user.model");

module.exports = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    if (userId) {
      const user = await User.findOne({ _id: userId });
      req.user = user;
    }

    next();
  } catch (error) {
    next(error);
  }
};
