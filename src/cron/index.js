'use strict';

const cronjob = require( 'cron' ).CronJob;

module.exports = function() {

    const app = this;
    const knex = app.get( 'knex' );

    // cronJobs

    // every 3 minutes
    new cronjob( '* */3 * * * *', () => {

        return Promise.all( [

            knex.schema.raw( 'fn_calculate_avg_temperature(:interval, :type)', { interval: '3 minutes', type: 'day' } ),
            knex.schema.raw( 'fn_calculate_avg_humidity(:interval, :type)', { interval: '3 minutes', type: 'day' } )

        ] )
        .then( () => {

            app.service( '/logs' ).create( { message: `insert new average values for day statistics (every 3 minutes) successfully` } );

        } )
        .catch( err => {

            app.service( '/logs' ).create( { type: 'error', message: `failed to insert average statistics data: ${err.toString()}` } );

        } );

    }, false, true );

};