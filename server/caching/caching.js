'use strict';
/**
 * Require our modules
 */
const caching = require('express').Router();
const logger = require('../utils/logger');
const cacheController = require('./controller/caching-controller');

/**
 * @description Clear the Cache
 * @TODO We might want to secure this API ;)
 * @method GET
 * @example http://localhost:3000/cache/clear
 */
caching.get('/clear', function (req, res) {

	// Clear the cache
	cacheController.clearCache().then(() => {
		// Log the clearing
		logger.info('Cache Cleared');
		// Return the success response
		res.json({
			status: 'OK',
			msg: 'Cache cleared'
		});
	}, err => {
		// Log the Error
		logger.error('Cache clear failed: ' + JSON.stringify( err) );
		// Return the error response 
		res.json({
			status: 500,
			msg: 'Cache could not be cleared'
		});
	});
});

// Export the module
module.exports = caching;