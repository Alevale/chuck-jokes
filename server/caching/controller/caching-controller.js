'use strict'
/**
 * Require our modules
 */
const config = require('../../../config/config')
const cacheManager = require('cache-manager')
const memoryCache = cacheManager.caching({
    store: config.caching.store,
    max: config.caching.max,
    ttl: config.caching.ttl
})

module.exports = {
    // Reset the Cache
    clearCache: () => {
        return memoryCache.reset()
    },
    // Get the Cache
    getMemoryCache: (key) => {
        return new Promise((resolve, reject) => {
            return memoryCache.get(key, (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(res);
            })
        })
    },
    // Set the Cache
    setMemoryCache: (key, values) => {
        return new Promise((resolve, reject) => {
            return memoryCache.set(key, values, (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(res);
            })
        })
    }
}
