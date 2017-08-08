'use strict';

const knex = require( 'knex' );
// transmitters
const setup_transmitter = require( './setup_transmitter' );
// receivers
const setup_receiver = require( './setup_receiver' );

module.exports = function () {
    
    const app = this;

    // transmitters
    app.configure( setup_transmitter );

    // receivers
    app.configure( setup_receiver );

};
