'use strict';

const jokes = require('express').Router();
const axios = require('axios');

jokes.get('/:amount?', async (req, res) => {
    const { amount = 10 } = req.params;

    // NOTE: Get the list of jokes to retrieve 20190430:Alevale
    const { data } = await axios.get(`http://api.icndb.com/jokes/random/${amount}`);

    // Return the User Object
    res.status( 200 ).json({
        data
    });
});

// Export the jokes
module.exports = jokes;

