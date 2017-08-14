'use strict';

const service = require( 'feathers-knex' );
const hooks = require( './hooks' );

module.exports = function () {
    const app = this;

    const options = {
        Model: app.get( 'knex' ),
        name: 'humidities_records'
    };

    // Initialize our service with any options it requires
    app.use( '/hardwares/humidities/records', service( options ) );

    const Service = app.service( '/hardwares/humidities/records' );
    Service.before( hooks.before );
    Service.after( hooks.after );

};
