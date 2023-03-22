var express = require("express");
var router = express.Router();

const Book = require("../models").Book;

/* Handler function to wrap each route. Function itself taken from
previous lessons, but is fully understood */
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

// Redirect from the home route to the /books route
router.get("/", (req, res) => {
  res.redirect("/books");
});

/* GET Library Books List 'home' page. */
router.get(
  "/books",
  asyncHandler(async (req, res, next) => {
    const books = await Book.findAll({ order: [["createdAt", "DESC"]] });
    res.render("index", { books: books, title: "Books Library" });
  })
);

//GET - create new book
router.get("/books/new", (req, res) => {
  /* Created a default empty book object and passed to pug template 
  so that first render passes with no errors (given future passes 
    will include the input value's, should title/author be null */
  const book = {};
  res.render("new-book", { book: book, title: "New Book" });
});

//POST - create new book
router.post(
  "/books/new",
  asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.create(req.body);
      res.redirect("/books/");
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        res.render("new-book", {
          book,
          errors: error.errors,
          title: "New Book",
        });
      } else {
        throw error;
      }
    }
  })
);

/* GET individual book. */
router.get(
  "/books/:id",
  asyncHandler(async (req, res,next) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.render("update-book", { book: book, title: book.title });
    } else {
      const err = new Error();
      err.status = 404;
      next(err);
    }
  })
);

/* POST: Update individual book */
router.post(
  "/books/:id/",
  asyncHandler(async (req, res,next) => {
    let book;
    try {
      book = await Book.findByPk(req.params.id);
      if (book) {
        await book.update(req.body);
        res.redirect("/books/");
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

/* POST delete book - opted for no GET here as the delete button 
is on the update page and book can just be deleted/destroyed 
from there */
router.post(
  "/books/:id/delete",
  asyncHandler(async (req, res,next) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      await book.destroy();
      res.redirect("/books");
    } 
  })
);

/* TEST ROUTE ONLY for error handling status 500 errors to 
trigger global middleware below to demonstrate error.pug template.
To be removed after code review */
router.get("/test-error", (req, res, next) => {
  const err = new Error("An unexpected server error has occurred.");
  err.status = 500;
  next(err);
});

// Middleware 404 error handler
router.use((req, res, next) => {
  const err = new Error("The page you were looking for does not exist.");
  err.status = 404;
  next(err);
});

// Middleware global error handler
router.use((err, req, res, next) => {
  if (err.status === 404) {
    res.status(404);
    res.render("page-not-found", { err });
  } else {
    err.status = 500;
    res.status(err.status || 500);
    res.render("error", { err });
  }
});

module.exports = router;
