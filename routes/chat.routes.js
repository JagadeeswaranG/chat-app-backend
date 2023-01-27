var express = require('express');
const { requireSignin, isAuth } = require('../utils/authentication');
var router = express.Router();


router.get('/:userID',isAuth, function(req, res) {
  res.send({message:"Welcome to chat room"});
});

module.exports = router;
