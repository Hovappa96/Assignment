const express = require("express")
const router = express.Router();
const userController = require("../controller/userController")
const authentication = require("../auth/auth")

router.post("/users", userController.createUser)

router.post("/login", userController.logIn)

router.get("/users", authentication.authentication, userController.getUsers)

module.exports = router;