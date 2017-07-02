'use strict';

const knex = require( 'knex' );
// transmitters
const setup_transmitter = require( './setup_transmitter' );

module.exports = function () {
    
    const app = this;

    // transmitters
    app.configure( setup_transmitter );

};
