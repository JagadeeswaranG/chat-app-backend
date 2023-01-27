var express = require('express');
const { getUser } = require('../controller/user.controller');
const { isAuth, requireSignin } = require('../utils/authentication');
var router = express.Router();

/* GET home page. */
router.get('/user', isAuth, getUser);

module.exports = router;
