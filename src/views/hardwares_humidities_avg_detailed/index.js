'use strict';

const service = require( 'feathers-knex' );
const hooks = require( './hooks' );

module.exports = function(){

    const app = this;

    const options = {
        Model: app.get( 'knex' ),
        name: 'humidities_avg_detailed'
    };

    // Initialize our service with any options it requires
    app.use( '/views/hardwares/humidities/avg/detailed', service( options ) );

    const Service = app.service( '/views/hardwares/humidities/avg/detailed' );
    Service.before( hooks.before );
    Service.after( hooks.after );

};
