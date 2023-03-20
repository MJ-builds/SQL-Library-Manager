var express = require("express");
var router = express.Router();

//think this is correct
const Book = require("../models").Book;

/* Handler function to wrap each route. Function taken from previous lessons */
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      // Forward error to the global error handler
      next(error);
    }
  };
}

// Redirect from the home route to the /books route - to figure out if this sits at the top
router.get('/', (req, res) => {
  res.redirect('/books');
});

/* GET home page. */
router.get("/books", asyncHandler(async (req, res, next) => {
    const books = await Book.findAll();
    /* instructions noted res.json but not sure it's required here with 
the way I have set things up? */

    //books data is passed to the index view - have included some test data in index.pug
    res.render("index", { books: books, title: "Placeholder" });
  })
);

module.exports = router;
