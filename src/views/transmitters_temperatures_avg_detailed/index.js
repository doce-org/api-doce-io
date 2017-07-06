'use strict';

const service = require( 'feathers-knex' );
const hooks = require( './hooks' );

module.exports = function(){
    
    const app = this;

    const options = {
        Model: app.get( 'knex' ),
        name: 'transmitters_temperatures_avg_detailed'
    };

    // Initialize our service with any options it requires
    app.use( '/views/transmitters/temperatures/avg/detailed', service( options ) );

    const transmitterTemperatureAvgDetailedView = app.service( '/views/transmitters/temperatures/avg/detailed' );
    transmitterTemperatureAvgDetailedView.before( hooks.before );
    transmitterTemperatureAvgDetailedView.after( hooks.after );

};
