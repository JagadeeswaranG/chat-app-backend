var express = require('express');
const { getUser, deleteUser } = require('../controller/user.controller');
const { isAuth, requireSignin } = require('../utils/authentication');
const { isAdmin } = require('../utils/rolebaseauth');
var router = express.Router();

/* GET home page. */
router.get('/user', isAuth, getUser);
router.delete("/user/:userId",isAuth, isAdmin, deleteUser);

module.exports = router;
