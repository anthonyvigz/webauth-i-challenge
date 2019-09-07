    
const express = require('express');
const server = express();


const bcrypt = require('bcrypt');
const Users = require('./users/userModel');
const restricted = require('./data/restricted.js')
const helmet = require('helmet')
const session = require('express-session');

server.use(helmet())
server.use(express.json()); 

server.use(
  session({
    name: 'notsession', // default is connect.sid
    secret: 'nobody tosses a dwarf!',
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      secure: true, // only set cookies over https. Server will not send back a cookie over http.
    }, // 1 day in milliseconds
    httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
    resave: false,
    saveUninitialized: false,
  })
);

server.get('/', (req, res) => {
    res.send(`<h2>Let's do this!</h2>`)
  });


server.post("/api/register", (req, res) => {
  const user = req.body;

  user.password = bcrypt.hashSync(user.password, 6);

  Users.addUser(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(err => {
      res.status(500).json({ message: "Error adding user: ", err });
    });
});

server.post('/api/login', async (req, res) => {

  const { username, password } = req.body;
  console.log(username)
  console.log(password)

  try {
      const user = await Users.findBy( { username })

      console.log(user);

      if (user && bcrypt.compareSync(password, user[0].password)){
          res.status(200).json({message:`Welcome user!`});

      }
      else {
          res.status(401).json({message: 'Invalid Credentials'})
      }
  }
  catch (error){
      console.log(error);
      res.status(500).json({
        message: 'Error creating a new login suckas',
      });

  }
});

server.get("/api/users", restricted, (req, res) => {

  Users.findUsers()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json({ message: "You shall not pass!" })
    });
});

module.exports = server;