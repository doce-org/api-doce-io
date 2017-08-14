'use strict';

const knex = require( 'knex' );
// hardwares
const setupHardware = require( './setup_hardware' );

module.exports = function () {

    const app = this;

    // transmitters
    app.configure( setupHardware );

};
