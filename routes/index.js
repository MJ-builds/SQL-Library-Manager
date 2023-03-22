var express = require("express");
var router = express.Router();

//debug testing
router.use((req, res, next) => {
  console.log("Request body:");
  console.dir(req.body);
  next();
});

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
    const books = await Book.findAll({ order: [["createdAt", "DESC"]] });
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
  let book;
  try {
    book = await Book.create(req.body);
  //to replace with res.redirect("/books" + book.id) when routes set up.
  res.redirect("/books/");
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book= req.params;
      res.render("new-book", {
        book,
        errors: error.errors,
        title: "New Book",
      });
    } else {
      throw error;
    }
  }
}));

/* GET individual book. */
router.get("/books/:id",asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render("update-book", { book: book, title: book.title });
  } else {
    res.sendStatus(404);
  }
})
);

/* POST: Update individual book */
router.post("/books/:id/",asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      // Can also change redirect to res.redirect("/books/" + book.id); but with an updated message
      res.redirect("/books/");
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render("update-book", {
        book,
        errors: error.errors,
        title: "Edit Book",
      });
    } else {
      throw error;
    }
  }
})
);

// POST delete book - opted for no GET here as the delete button is on the update page and book can just be deleted/destroyed from there
router.post("/books/:id/delete",asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    await book.destroy();
    res.redirect("/books");
  } else {
    res.sendStatus(404);
  }
})
);

module.exports = router;
