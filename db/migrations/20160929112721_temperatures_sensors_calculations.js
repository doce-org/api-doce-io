'use strict';

exports.up = function( knex, Promise ) {

	return Promise.all( [

		knex.schema.createTable( 'temperatures_sensors_calculations', table => {
			table.increments( 'id' ).primary();
			table.integer( 'temperature_sensor_id' ).notNullable().references( 'id' ).inTable( 'temperatures_sensors' );
			table.enum( 'type', [ 'hour', 'day', 'month' ] ).notNullable();
			table.decimal( 'lowest' ).notNullable();
			table.decimal( 'highest' ).notNullable();
			table.decimal( 'average' ).notNullable();
			table.datetime( 'start' ).notNullable();
			table.datetime( 'end' ).notNullable();
			table.timestamp( 'created_at' ).notNullable().defaultTo( knex.raw( 'now()' ) );
		} )

	] )
  
};

exports.down = function( knex, Promise ) {

	return Promise.all( [

		knex.schema.dropTable( 'temperatures_sensors_calculations' )

	] )
  
};
