const User = require("../models/User");

const userController = {
  //GET ALL USERS
  getAllUsers: async (req, res) => {
    try {
      const user = await User.find();
      return res.status(200).json(user);
    } catch (err) {
      return res.status(500).json(err);
    }
  },

  // DELETE USER
  deleteUser: async (req, res) => {
    try {
      // Xóa thực trong DB
      // const user = await User.findByIdAndDelete(req.params.id);
      const user = await User.findById(req.params.id);
      return res.status(200).json("Delete Successfully!");
    } catch (err) {
      return res.status(500).json(err);
    }
  },
};

module.exports = userController;
