'use strict';
/**
 * Require our modules
 */
const config = require('../../../../config/config');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const models = require('../../../../database/models');

// Define our models
const Users = models.Users;
const Roles = models.Roles;
const Branches = models.Branches;

const self = module.exports = {
    // Get 
    getDecodedToken: function( token ){
        // Check if token is given
        if( token ){
            // Try to decode the JWT-Token
            try{
                const jwt_token = jwt.decode(token.replace('Bearer ', ''), config.jwt.secret);
                return jwt_token;
            } catch( err ){
                return false;
            }
        } else {
            return false;
        }
    },
    // Get a User Object from the Database
    getUserFromDB: function( guid ){
        return new Promise(function (resolve, reject) {
            Users.findOne({
                attributes: ['firstname', 'lastname','email', 'username', 'status'],
                include: [
                    { model: models.Roles, attributes: ['id', 'name', 'isAdmin'] },
                    { model: models.Branches, attributes: [ 'id', 'name', 'city'] }
                ],
                where: {
                    guid: guid
                }
            }).then(userObject => {
                // Check if we have a User Object
                if( userObject ){
                    resolve( userObject );
                } else {
                    // No User Object found
                    reject();
                }
            }, err => {
                // Could not Query
                reject();
            });
        });
    },
    // Get the loggedin User
    getLoggedInUserObject: function( token ){    
        return new Promise(function (resolve, reject) {
            // Extract & Validate the Token
            const jwt_token = self.getDecodedToken( token );
            // Check if the Token is valid
            if (jwt_token) {
                // Get the User Object
                return self.getUserFromDB( jwt_token.guid ).then( userObject => {
                    resolve( userObject )
                }, err => {
                    reject();
                });
            } else {
                reject();
            }
        });
    }
}