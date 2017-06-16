// import Firebase from 'firebase'
var Firebase = require('firebase/app');
require('firebase/database');

var config = require('./firebase-config.js')
var fb = Firebase.initializeApp(config)

export const db = fb.database() //this doesnt have to be database only

// module.exports = 'Hello world';