'use strict';

const fs = require( 'fs' );
const sql_folder = '20170706141251_average_views';

const create_view_transmitters_temperatures_avg_detailed = fs.readFileSync(
	`${__dirname}/../sql/${sql_folder}/views/create_view_transmitters_temperatures_avg_detailed.sql` ).toString();
const create_view_transmitters_humidities_avg_detailed = fs.readFileSync(
	`${__dirname}/../sql/${sql_folder}/views/create_view_transmitters_humidities_avg_detailed.sql` ).toString();

exports.up = function( knex, Promise ) {

    return Promise.all( [

        knex.schema.raw( create_view_transmitters_temperatures_avg_detailed ),
        knex.schema.raw( create_view_transmitters_humidities_avg_detailed )

    ] );
  
};

exports.down = function( knex, Promise ) {

    return Promise.all( [

        knex.schema.raw( 'DROP VIEW IF EXISTS transmitters_temperatures_avg_detailed;' ),
        knex.schema.raw( 'DROP VIEW IF EXISTS transmitters_humidities_avg_detailed;' )

    ] );
  
};
