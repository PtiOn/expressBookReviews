const express = require('express');
const books = require('./booksdb'); 
const promise_routes = express.Router();

// Route 1: Get book list available in the shop
promise_routes.get('/', (req, res) => {
    let getBooksPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(books);
        }, 6000); // Simule un délai de 6 secondes
    });

    getBooksPromise
        .then((bookList) => {
            res.send(JSON.stringify(bookList, null, 4)); // Renvoie la liste des livres
        })
        .catch((error) => {
            res.status(500).send({ message: "An error occurred", error });
        });
});

// Route 2: Get book details based on ISBN
promise_routes.get('/isbn/:isbn', (req, res) => {
    let getBookByIsbnPromise = new Promise((resolve, reject) => {
        const isbn = req.params.isbn;
        const book = books[isbn];
        if (book) {
            setTimeout(() => resolve(book), 3000); // Simule un délai de 3 secondes
        } else {
            reject("Book not found");
        }
    });

    getBookByIsbnPromise
        .then((book) => {
            res.send(book);
        })
        .catch((error) => {
            res.status(404).send({ message: error });
        });
});

// Route 3: Get book details based on author
promise_routes.get('/author/:author', (req, res) => {
    let getBooksByAuthorPromise = new Promise((resolve, reject) => {
        const author = req.params.author;
        let filtered_author = Object.values(books).filter((book) => book.author === author);
        if (filtered_author.length > 0) {
            setTimeout(() => resolve(filtered_author), 3000); // Simule un délai de 3 secondes
        } else {
            reject("No books found for this author");
        }
    });

    getBooksByAuthorPromise
        .then((books) => {
            res.send(books);
        })
        .catch((error) => {
            res.status(404).send({ message: error });
        });
});

// Route 4: Get all books based on title
promise_routes.get('/title/:title', (req, res) => {
    let getBooksByTitlePromise = new Promise((resolve, reject) => {
        const title = req.params.title;
        let filtered_title = Object.values(books).filter((book) => book.title === title);
        if (filtered_title.length > 0) {
            setTimeout(() => resolve(filtered_title), 3000); // Simule un délai de 3 secondes
        } else {
            reject("No books found for this title");
        }
    });

    getBooksByTitlePromise
        .then((books) => {
            res.send(books);
        })
        .catch((error) => {
            res.status(404).send({ message: error });
        });
});

// Route 5: Get book review
promise_routes.get('/review/:isbn', (req, res) => {
    let getBookReviewPromise = new Promise((resolve, reject) => {
        const isbn = req.params.isbn;
        const book = books[isbn];
        if (book && book.reviews) {
            setTimeout(() => resolve(book.reviews), 3000); // Simule un délai de 3 secondes
        } else {
            reject("Reviews not found or book does not exist");
        }
    });

    getBookReviewPromise
        .then((reviews) => {
            res.send(reviews);
        })
        .catch((error) => {
            res.status(404).send({ message: error });
        });
});

module.exports.promise = promise_routes;
