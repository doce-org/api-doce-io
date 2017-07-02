'use strict';

const service = require( 'feathers-knex' );
const hooks = require( './hooks' );

module.exports = function () {
    const app = this;

    const options = {
        Model: app.get( 'knex' ),
        name: 'transmitters_humidities_records'
    };

    // Initialize our service with any options it requires
    app.use( '/transmitters/humidities/records', service( options ) );

    const transmitterHumidityRecordService = app.service( '/transmitters/humidities/records' );
    transmitterHumidityRecordService.before( hooks.before );
    transmitterHumidityRecordService.after( hooks.after );

};
