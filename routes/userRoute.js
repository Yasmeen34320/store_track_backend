// const express = require("express");
// const router = express.Router();
// const userController = require("../controllers/userController");
// const adminAuth = require("../middlewares/adminAuth");

// // login route (public)
// router.post("/login", userController.login);

// // only admin can access the following routes:
// router.post("/", adminAuth, userController.addUser);
// router.get("/", adminAuth, userController.getAllUsers);
// router.get("/:id", adminAuth, userController.getUserById);
// router.put("/:id", adminAuth, userController.updateUser);
// router.delete("/:id", adminAuth, userController.deleteUser);

// module.exports = router;


const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const adminAuth = require("../middlewares/auth.middleware");

router.post("/login", userController.Login);
// router.post("/", adminAuth, userController.addUser);
router.post("/", userController.addUser);

router.get("/", adminAuth, userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", adminAuth, userController.updateUser);
router.delete("/:id", adminAuth, userController.deleteUser);

module.exports = router;
