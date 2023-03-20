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
    res.render("index", { books: books, title: "Books Library" });
  })
);

//GET - create new book
router.get("/books/new", (req, res) => {
  res.render("new-book", { books: {}, title: "New Book" });
});

//POST - create new book

router.post("/books/", asyncHandler(async (req, res) => {
  const book = await Book.create(req.body);
  //to replace with res.redirect("/books" + article.id) when routes set up.
  res.redirect("/books/" + book.id);
}));

/* GET individual article. */
router.get("/books/:id",asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render("update-book", { book: book, title: book.title });
  } else {
    res.sendStatus(404);
  }
})
);

module.exports = router;
