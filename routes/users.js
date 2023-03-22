var express = require('express');
var router = express.Router();

// Import the Book model - including now to be needed later.
//also imported in the index route - not sure if both required as yet
// const Book = require('../models').Book;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
