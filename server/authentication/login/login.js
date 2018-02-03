'use strict';
/**
 * Require our modules
 */
const config = require('../../../config/config');
const login = require('express').Router();
const jwt = require('jsonwebtoken');
const Users = require('../../../database/models').Users;
const logger = require('../../utils/logger');
const controller = require('./controller/login-controller');

/**
 * Login
 */
login.options('/')
login.post('/', function (req, res, next) {
	// Check to see if the user is known by username or email
	controller.findUser( req.body.username ).then( userObject => {
		// Found the user, verify the passwords
		controller.verifyPassword( req.body.password, userObject.password).then( login => {
			// Remove the Password from the User Object for the response
			userObject.password = undefined;
			delete userObject.password;
			// Create the Payload
			const payload = { id: userObject.id, guid: userObject.guid, exp: Math.floor(Date.now() / 1000) + (60 * config.jwt.token_expiration), email: userObject.email };
			// Sign the Payload;
			const token = jwt.sign(payload, config.jwt.secret);
			// Log that the user logged in
			logger.info( 'Login: ' + userObject.email + ' logged in');
			// Return the results
			res.status(200).json({
				token: token,
				user: userObject
			});
		}, err => {
			// Log that the user provided a wrong password
			logger.warn( 'Login: ' + userObject.email + ' provided a wrong password' );
			// Passwords don't match
			res.status(403).json({
				error: 'Wrong password'
			});
		});
	}, err => {
		// Log that the provided username does not exist
		logger.warn( 'Login: Username or Email ' + req.body.username + ' tried to login but does not exist' );
		// Return that the user is not found in the database
		res.status(403).json({
			error: 'User not found!'
		});
	});
});

// Export the Sanitycheck module
module.exports = login;