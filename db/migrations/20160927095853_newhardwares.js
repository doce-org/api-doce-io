'use strict';

exports.up = function( knex, Promise ) {

	return Promise.all( [

		knex.schema.createTable( 'new_hardwares', table => {
			table.increments( 'id' ).primary();
			table.string( 'hardware_id' ).notNullable();
			table.string( 'type' ).notNullable();
			table.timestamp( 'created_at' ).notNullable().defaultTo( knex.raw( 'now()' ) );
		} )

	] )
  
};

exports.down = function( knex, Promise ) {

	return Promise.all( [

		knex.schema.dropTable( 'new_hardwares' )

	] )
  
};
