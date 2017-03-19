'use strict';

const service = require( 'feathers-knex' );
const hooks = require( './hooks' );

module.exports = function(){
    const app = this;

    const options = {
        Model: app.get( 'knex' ),
        name: 'hardwares_humidities'
    };

    // Initialize our service with any options it requires
    app.use( '/views/hardwares/humidities', service( options ) );

    const hardwareHumidityView = app.service( '/views/hardwares/humidities' );
    hardwareHumidityView.before( hooks.before );
    hardwareHumidityView.after( hooks.after );

};
