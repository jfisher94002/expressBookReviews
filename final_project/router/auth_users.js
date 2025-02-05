const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = []

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let userswithsamename = users.filter((user)=>{
    return users.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  console.log("AuthenticatedUser:username = ", username, ", pass=", password)
  //console.log("AuthenticatedUser:user = ", users[0].username)
  let validusers = users.filter((user)=>{
    console.log("Authenticated: Filter: User = ", user.username, ", Pass=", user.password)
    console.log("Authenticated: Filter: matching user = ", username, ", pass=", password)
    console.log("usernames match? ", user.username === username)
    console.log("passwords match? ", user.password === password)
    if (user.username === username && user.password === password) {
        console.log("Authenticated: Filter: Returning ", user)
        return user
    }
  });
  console.log("AuthenticatedUser:validUsers = ", validusers)
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.query.username;
  const password = req.query.password;
  console.log("Login: username = ", username, ", password =", password)
  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: username
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
    }
    return res.status(200).send("User successfully logged in.");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  isbn = req.params.isbn;
  review = req.body.review;
  reviews = books[isbn].reviews;
  user = req.user.data
  console.log("Get ISBN => ", isbn)
  console.log("Review: review = ", review)
  console.log("username => ", req.user)

  res.status(200).json({message:"The review for book with ISBN :" + isbn + " has been added/updated"})

});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    isbn = req.params.isbn;
    user = req.user.data
    console.log("Delete book ", isbn, ", for user ", user)
    delete books[isbn]['reviews'][user];
    res.status(200).json({message:"Deleted Users' review", review})

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
