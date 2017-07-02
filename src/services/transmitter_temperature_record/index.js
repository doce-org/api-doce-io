'use strict';

const service = require( 'feathers-knex' );
const hooks = require( './hooks' );

module.exports = function () {
    const app = this;

    const options = {
        Model: app.get( 'knex' ),
        name: 'transmitters_temperatures_records'
    };

    // Initialize our service with any options it requires
    app.use( '/transmitters/temperatures/records', service( options ) );

    const transmitterTemperatureRecordService = app.service( '/transmitters/temperatures/records' );
    transmitterTemperatureRecordService.before( hooks.before );
    transmitterTemperatureRecordService.after( hooks.after );

};
