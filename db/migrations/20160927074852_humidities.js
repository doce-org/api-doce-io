'use strict';

exports.up = function( knex, Promise ) {

	return Promise.all( [

		knex.schema.createTable( 'humidities_sensors', table => {
			table.increments( 'id' ).primary();
			table.integer( 'room_id' ).notNullable().references( 'id' ).inTable( 'rooms' );
			table.string( 'hardware_id' ).notNullable();
			table.string( 'name' ).notNullable();
			table.timestamp( 'created_at' ).notNullable().defaultTo( knex.raw( 'now()' ) );
			table.timestamp( 'updated_at' ).notNullable().defaultTo( knex.raw( 'now()' ) );
		} ),

		knex.schema.createTable( 'humidities_sensors_records', table => {
			table.increments( 'id' ).primary();
			table.integer( 'humidities_sensor_id' ).notNullable().references( 'id' ).inTable( 'humidities_sensors' );
			table.decimal( 'humidity' ).notNullable();
			table.timestamp( 'created_at' ).notNullable().defaultTo( knex.raw( 'now()' ) );
		} )

	] )
  
};

exports.down = function( knex, Promise ) {

	return Promise.all( [

		knex.schema.dropTable( 'humidities_sensors' ),
		knex.schema.dropTable( 'humidities_sensors_records' )

	] )
  
};
