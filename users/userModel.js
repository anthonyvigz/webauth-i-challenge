const db = require('../data/dbConfig.js');

module.exports = { 
    addUser,
    findBy,
    findUsers
}


function findById(id) {
    return db('users')
        .where({ id })
        .first();
}


function addUser(user) {
    return db('users')
      .insert(user, 'id')
      .then(ids => {
        const [id] = ids;
        return findById(id);
      });
  }

  function findBy(user) {
    return db('users').where(user)
}


function findUsers() {
    return db('users')
}