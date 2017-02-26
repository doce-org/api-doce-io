'use strict';

const service = require( 'feathers-knex' );
const hooks = require( './hooks' );

module.exports = function () {
    const app = this;

    const options = {
        Model: app.get( 'knex' ),
        name: 'powers_meters_records'
    };

    // Initialize our service with any options it requires
    app.use( '/powers/meters/records', service( options ) );

    const powerMeterRecordService = app.service( '/powers/meters/records' );
    powerMeterRecordService.before( hooks.before );
    powerMeterRecordService.after( hooks.after );

};
