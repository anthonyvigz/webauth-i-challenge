    
const express = require('express');
const server = express();


const bcrypt = require('bcrypt');
const Users = require('./data/user-model.js');
const restricted = require('./data/restricted.js')
const helmet = require('helmet')


server.use(helmet())
server.use(express.json()); 


server.get('/', (req, res) => {
    res.send(`<h2>Let's do this authy business!</h2>`)
  });


  server.post('/api/register', async (req, res) => {
    try {
      console.log(req.body)
        const userInfo= await req.body
        
        userInfo.password = await bcrypt.hashSync(userInfo.password, 10)
        const user = await Users.addUser(userInfo)
        
        res.status(201).json(user);
    }

    catch (error){
        console.log(error);
        res.status(500).json({
          message: 'Error creating a new user suckas',
        });
  
    }
  });

  server.post('/api/login', async (req, res) => {

    let {username, password} = req.body;
    console.log(username)
    console.log(password)

    try {
        const user = await Users.findBy( { username })
        console.log(user);
        console.log(req.session);
        if (user && bcrypt.compareSync(password, user[0].password)){
            req.session.user=user;
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

server.get('/api/users', restricted, async (req, res) => {
    try {
      
     const users= await Users.findUsers()
    
      res.status(200).json(users);
    } catch (error) {
      
      res.status(500).json({
        message: 'Error retrieving the dang users',
      });
    }
  });

module.exports = server;