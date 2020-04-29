// Auth built following this tutorial 
// https://www.digitalocean.com/community/tutorials/api-authentication-with-json-web-tokensjwt-and-passport
const fs = require('fs')
const path = require('path')
const models = require('../../models')
const passport = require('passport')
function addPassport() {
  fs.readdirSync(__dirname)
    .filter(file => file.indexOf('.') !== 0 && file !== 'index.js') // get all the model files
    .forEach((file) => {
      require(path.join(__dirname, file))(passport, models)
    })
    return passport
}

module.exports = addPassport
