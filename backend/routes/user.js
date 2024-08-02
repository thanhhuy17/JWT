const middlewareController = require("../controllers/middlewareController");
const userController = require("../controllers/userController");

const router = require("express").Router();
//GET ALL USERS
router.get("/", middlewareController.verifyToken, userController.getAllUsers);

//DELETE USERS
// v1/user/123456
router.delete(
  "/:id",
  middlewareController.verifyTokenForAdminAuth,
  userController.deleteUser
);

module.exports = router;
