'use strict';

const service = require( 'feathers-knex' );
const hooks = require( './hooks' );

module.exports = function(){
    const app = this;

    const options = {
        Model: app.get( 'knex' ),
        name: 'hardwares_temperatures'
    };

    // Initialize our service with any options it requires
    app.use( '/views/hardwares/temperatures', service( options ) );

    const hardwareTemperatureView = app.service( '/views/hardwares/temperatures' );
    hardwareTemperatureView.before( hooks.before );
    hardwareTemperatureView.after( hooks.after );

};
