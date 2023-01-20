const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.query.username;
  const password = req.query.password;
  console.log("Registering: username = ", username, ", pass = ", password)
  if (username && password) {
    if (!isValid(username)) {
      console.log("Register: user => ", username)
      console.log("password => ", password)
      users.push({"username":username,"password":password});
      console.log("users => ", users[0])
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

public_users.get("/auth/get_message", (req,res) => {
  return res.status(200).json({message: "Hello, You are an authenticated user. Congratulations!"});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    console.log("Get:Get the full book list.")
    try {
        const result = await new Promise((resolve, reject) => {
            resolve(JSON.stringify(books, null, 4));
        });
        res.status(200).send(result);
    } catch (error) {
        res.status(404).send(error);
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {

    const isbn = req.params.isbn;
    console.log("Get ISBN = ", isbn)
    new Promise((resolve, reject) => {
        const filteredBook = books[isbn];
        if (filteredBook) {
            resolve(JSON.stringify(filteredBook, null, 4));
        } else {
            reject(`There is no book that match the provided ISBN.`);
        }
    })
        .then(result => {
            res.status(200).send(result);
        })
        .catch(error => {
            res.status(404).send(error);
        });
});


// Get book details based on author
public_users.get('/author/:author', function (req, res) {

    const author = req.params.author;
    console.log("Get Author = ", author)
    let selectedBooks = [];

   let selectBook = new Promise((resolve, reject) => {
     try {
        Object.values(books).forEach((val) => {
           if (val.author === author) {
              console.log("Get: Auther: pushing ", author)
              selectedBooks.push(val);
           }
        });

       if (selectedBooks.length === 0) {
         resolve("Unable to find books with the author name");
       } else {
         resolve(selectedBooks);
       }
       resolve(selectedBooks);
     } catch (err) {
       reject(err);
     }
   });
   selectBook.then(
       (data) => res.send(data),
       (err) => res.send(`There was an error in finding books with the author name: ${err}`)
   );

});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {

    const title = req.params.title;
    console.log("Title: = ", title)
    let selectedBooks = [];

   let selectBook = new Promise((resolve, reject) => {
      try {
         Object.values(books).forEach((val) => {
            if (val.title === title) {
               console.log("Get: Title: pushing ", title)
               selectedBooks.push(val);
            }
         });

        if (selectedBooks.length === 0) {
          resolve("Unable to find books with the title.");
        } else {
          resolve(selectedBooks);
        }
        resolve(selectedBooks);
      } catch (err) {
        reject(err);
      }
    });
    selectBook.then(
        (data) => res.send(data),
        (err) => res.send(`There was an error in finding books with the title: ${err}`)
    );
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    new Promise((resolve, reject) => {
        const review = books[isbn].reviews
        //if (review.length > 0) {
            resolve(JSON.stringify(review, null, 4))
        //} else {
        //    reject(`There are no reviews about this book.`)
       // }
    })
        .then(result => {
            res.status(200).send(result)
        })
        .catch(error => {
            res.status(404).send(error)
        })
});
module.exports.general = public_users;
