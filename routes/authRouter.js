var express = require('express');
const { doSignUp,doLogin } = require('../controllers/authController');
var router = express.Router();


router.post('/signup',doSignUp)
router.post('/login',doLogin)
 

module.exports = router;
  