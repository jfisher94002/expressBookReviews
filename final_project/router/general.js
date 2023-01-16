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

function myResult(status) {
    console.log("myResult = ", status)
}
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  console.log("Get: Book list")

  let myPromise = new Promise(function(resolve,reject) {
      resolve("OK")
  });
  myPromise.then((successMessage) => {
      if (successMessage === "OK") {
        console.log("From Callback " + successMessage)
        return "OK"
      } else {
        console.log("Invalid result from then")
        return "Bad"
      }
  });
  console.log("res status = ", res.statusCode)
  if (res.statusCode == 200){
      return res.send(JSON.stringify({books}))
  } else {
      return res.status(300).json({message: "Invalid result"});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  isbn = req.params.isbn
  console.log("Get ISBN => ", isbn, ", length = ", Object.keys(books).length)
  if (isbn > Object.keys(books).length) {
    return res.status(404).json({message: "Invalid ISBN = ", isbn})
  }
  let myPromise = new Promise(function(resolve,reject) {
        resolve("OK")
    });
    myPromise.then((successMessage) => {
        if (successMessage === "OK") {
          console.log("From Callback " + successMessage)
          return "OK"
        } else {
          console.log("Invalid result from then")
          return "Bad"
        }
    });
    console.log("res status = ", res.statusCode)
    if (res.statusCode == 200){
        return res.send(books[isbn]);
    } else {
        return res.status(300).json({message: "Invalid result"});
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    console.log("Get: Author => ", author)

    const bookAuthors = [];
    for (const bookId in books) {
       // Get the current book
       const book = books[bookId];
       if (book.author === author) {
         // If the book was written by the specified author, add it to the 'authorsBooks' array
         bookAuthors.push(book);
       }
     }
    let myPromise = new Promise(function(resolve,reject) {
        resolve("OK")
    });
    myPromise.then((successMessage) => {
        if (successMessage === "OK") {
          console.log("From Callback " + successMessage)
          return "OK"
        } else {
          console.log("Invalid result from then")
          return "Bad"
        }
    });
    console.log("res status = ", res.statusCode)
    if (res.statusCode == 200){
         return res.send(bookAuthors);
    } else {
        return res.status(300).json({message: "Invalid result"});
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  console.log("Get: Title => ", title)
  const bookTitles = []
  for (const bookId in books) {
    const book = books[bookId]
    if (book.title === title) {
        bookTitles.push(book)
    }
  }
    let myPromise = new Promise(function(resolve,reject) {
        resolve("OK")
    });
    myPromise.then((successMessage) => {
        if (successMessage === "OK") {
          console.log("From Callback " + successMessage)
          return "OK"
        } else {
          console.log("Invalid result from then")
          return "Bad"
        }
    });
    console.log("res status = ", res.statusCode)
    if (res.statusCode == 200){
         return res.send(bookTitles)
    } else {
        return res.status(300).json({message: "Invalid result"});
    }

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  console.log("Get: Review => ", isbn)
  if (isbn > books.length) {
      return res.status(404).json({message: "Invalid ISBN = ", isbn})
  }
  console.log(books[isbn].reviews)
  return res.send(books[isbn].reviews)
});

module.exports.general = public_users;
