'use strict';

exports.up = function( knex, Promise ) {

	return Promise.all( [

		knex.schema.createTable( 'powers_gauges', table => {
			table.increments( 'id' ).primary();
			table.integer( 'room_id' ).notNullable().references( 'id' ).inTable( 'rooms' );
			table.string( 'hardware_id' ).notNullable();
			table.string( 'name' ).notNullable();
			table.timestamp( 'created_at' ).notNullable().defaultTo( knex.raw( 'now()' ) );
			table.timestamp( 'updated_at' ).notNullable().defaultTo( knex.raw( 'now()' ) );
		} ),

		knex.schema.createTable( 'powers_gauges_records', table => {
			table.increments( 'id' ).primary();
			table.integer( 'power_gauge_id' ).notNullable().references( 'id' ).inTable( 'powers_gauges' );
			table.decimal( 'power' ).notNullable().defaultTo( 0 );
			table.integer( 'energy' ).notNullable();
			table.timestamp( 'created_at' ).notNullable().defaultTo( knex.raw( 'now()' ) );
		} )

	] )
  
};

exports.down = function( knex, Promise ) {

	return Promise.all( [

		knex.schema.dropTable( 'powers_gauges_records' ),
		knex.schema.dropTable( 'powers_gauges' )

	] )

  
};
