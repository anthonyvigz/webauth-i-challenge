    
const express = require('express');
const server = express();


const bcrypt = require('bcrypt');
const Users = require('./users/userModel');
const db = require('./data/dbConfig')

const restricted = require('./data/restricted.js')
const helmet = require('helmet')
const session = require('express-session');
const connectSessionKnex = require('connect-session-knex')

server.use(helmet())
server.use(express.json()); 

const KnexSessionStore = connectSessionKnex(session)

const sessionConfig = {
  name: "notsession", // default is connect.sid
  // This should not be hardcoded. This should be in an env variable
  secret: "secret",
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day in milliseconds
    secure: false // set to TRUE in production -- only set cookies over https. Server will not send back a cookie over http.
  }, 
  httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
  resave: false,
  saveUninitialized: false,
  // Where do we store our sessions? defaults to server
  store: new KnexSessionStore({
    knex: db,
    tablename: 'sessions',
    sidfieldname: "sid",
    createtable: true,
    clearInterval: 1000 * 60 * 60 * 24 * 1
  })
};

server.use(session(sessionConfig))

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
          req.session.user = user;
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