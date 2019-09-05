const express = require('express');
const helmet = require('helmet');

const server = require('./server.js')

server.use(express.json());
server.use(helmet());


const port = 5000;

server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});