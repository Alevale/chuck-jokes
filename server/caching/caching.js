'use strict';
/**
 * Require our modules
 */
const caching = require('express').Router();
const logger = require('../utils/logger');
const cacheController = require('./controller/caching-controller');

const passport = require('passport');
const passportController = require('../middleware/passport/controller/passport-controller');

/**
 * @description Clear the Cache
 * @TODO We might want to secure this API ;)
 * @method GET
 * @example http://localhost:3000/cache/clear
 */
caching.get('/clear', (req, res) => {

	// Clear the cache
	cacheController.clearCache().then(() => {
		// Log the clearing
		logger.info('Cache Cleared');
		// Return the success response
		res.json({
			msg: 'Cache cleared'
		});
	}, err => {
		// Log the Error
		logger.error('Cache clear failed: ' + JSON.stringify( err) );
		// Return the error response
		res.json({
			err: 'Cache could not be cleared'
		});
	});
});

/**
 * @description Get the items in the cache
 * @method GET
 * @example http://localhost:3000/cache/get
 */
caching.get('/get', (req, res) => {

    passportController.getLoggedInUserObject(req.headers.authorization).then(userObject => {
        const { email } = userObject;
        return cacheController
            .getMemoryCache(email)
            .then((result) => {
                // Return the success response
                return res.json({
                    result
                });
            })
			.catch(err => {
                // Log the Error
                logger.error('Cache error: ' + JSON.stringify(err));
                // Return the error response
                res.json({
                    err: 'Error getting Cache'
                });
            });
    }, () => {
        return res.status( 403 ).json({
            err: 'Unauthorized'
        });
    });
});

/**
 * @description Set the items in the cache
 * @method POST
 * @example http://localhost:3000/cache/set
 */
caching.post('/set', (req, res) => {

    passportController.getLoggedInUserObject(req.headers.authorization).then(userObject => {
        const { email } = userObject
        return cacheController
            .setMemoryCache(email, req.body)
            .then((result) => {
                logger.info('Object saved in memory')
                // Return the success response
                return res.json({
                    result
                });
            })
			.catch(err => {
                // Log the Error
                logger.error('Cache error: ' + JSON.stringify(err));
                // Return the error response
                return res.status( 400 ).json({
                    err: 'Item could not be saved in Cache'
                });
            });
    }, () => {
        return res.status( 403 ).json({
            err: 'Unauthorized'
        });
    });
});

// Export the module
module.exports = caching;
