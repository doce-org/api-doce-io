'use strict';

const fs = require( 'fs' );
const sql_folder = '20170319125729_hardwares_humidities_statistics';

const create_fn_calculate_avg_humidity = fs.readFileSync(
	`${__dirname}/../sql/${sql_folder}/functions/create_fn_calculate_avg_humidity.sql` ).toString();

exports.up = function( knex, Promise ) {

	return Promise.all( [

		knex.schema.createTable( 'hardwares_humidities_avg', table => {
			table.increments( 'id' ).primary();
			table.integer( 'hardware_id' ).notNullable().references( 'id' ).inTable( 'hardwares' );
			table.decimal( 'avg_humidity' ).notNullable();
			table.decimal( 'avg_temperature' ).notNullable();
			table.string( 'type' ).notNullable();
			table.timestamp( 'created_at' ).notNullable();

			table.index( 'hardware_id' );
			table.index( 'type' );
		} ),

		knex.schema.raw( create_fn_calculate_avg_humidity )

	] );

};

exports.down = function( knex, Promise ) {

	return Promise.all( [

		knex.schema.raw( 'DROP FUNCTION fn_calculate_avg_humidity(varchar, varchar);' ),

		knex.schema.dropTable( 'hardwares_humidities_avg' )

	] );

};
