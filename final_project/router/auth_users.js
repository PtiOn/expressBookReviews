const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
// Filter the users array for any user with the same username and password
    let isValid = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (isValid.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const user = req.body.user;
    if (!user) {
        return res.status(404).json({ message: "Body Empty" });
    }
    // Generate JWT access token
    let accessToken = jwt.sign({
        data: user
    }, 'access', { expiresIn: 60 * 60 });
    // Store access token in session
    req.session.authorization = {
        accessToken
    }
    return res.status(200).send("User successfully logged in");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const token = req.session.authorization?.accessToken;

    // Vérification de l'authentification
    if (!token) {
        return res.status(401).json({ message: "User must log in to add or edit a review" });
    }

    let username;
    try {
        // Décoder le token pour obtenir le nom d'utilisateur
        const decoded = jwt.verify(token, "access");
        username = decoded.data.username;
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }

    const isbn = req.params.isbn;
    const reviewText = req.body.review;

    // Vérifier si le livre existe
    const book = books[isbn];
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Initialiser les critiques si elles n'existent pas
    if (!book.reviews) {
        book.reviews = {};
    }

    // Ajouter ou mettre à jour la critique
    book.reviews[username] = { review: reviewText, date: new Date().toISOString() };

    return res.status(200).json({ message: "Review added successfully", reviews: book.reviews });
});

// Supprimer une critique d'un livre
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const token = req.session.authorization?.accessToken;

    // Vérification de l'authentification
    if (!token) {
        return res.status(401).json({ message: "User must log in to delete a review" });
    }

    // Décodage du token pour obtenir l'utilisateur
    let username;
    try {
        const decoded = jwt.verify(token, "access");
        username = decoded.data.username;
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }

    const isbn = req.params.isbn;

    // Vérifier si le livre existe
    const book = books[isbn];
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Vérifier si une critique existe pour cet utilisateur
    if (!book.reviews || !book.reviews[username]) {
        return res.status(404).json({ message: "No review found for this user" });
    }

    // Supprimer la critique
    delete book.reviews[username];
    return res.status(200).json({ message: "Review deleted successfully", reviews: book.reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
