var express = require("express");
const { register, signin, signout,forgotPassword, resetPassword } = require("../controller/auth.controller");
var router = express.Router();

/* GET home page. */
router.post("/register",register);

router.post("/signin", signin);

router.get("/signout",signout);

router.post("/forgotPassword", forgotPassword);

router.post("/resetPassword", resetPassword);

module.exports = router;
