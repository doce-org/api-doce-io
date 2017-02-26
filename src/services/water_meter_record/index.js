'use strict';

const service = require( 'feathers-knex' );
const hooks = require( './hooks' );

module.exports = function () {
    const app = this;

    const options = {
        Model: app.get( 'knex' ),
        name: 'waters_meters_records'
    };

    // Initialize our service with any options it requires
    app.use( '/waters/meters/records', service( options ) );

    const waterMeterRecordService = app.service( '/waters/meters/records' );
    waterMeterRecordService.before( hooks.before );
    waterMeterRecordService.after( hooks.after );

};
