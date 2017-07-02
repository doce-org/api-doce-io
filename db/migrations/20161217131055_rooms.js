'use strict';

exports.up = function( knex, Promise ) {

	return Promise.all( [

		knex.schema.createTable( 'rooms', table => {
			table.increments( 'id' ).primary();
			// TODO handle room icons
			// table.integer( 'room_icon_id' ).notNullable().references( 'id' ).inTable( 'rooms_icons' );
			table.string( 'name' ).notNullable();
			table.timestamp( 'created_at' ).notNullable().defaultTo( knex.raw( 'now()' ) );
			table.timestamp( 'updated_at' ).notNullable().defaultTo( knex.raw( 'now()' ) );
		} )

	] );

};

exports.down = function( knex, Promise ) {

	return Promise.all( [

		knex.schema.dropTable( 'rooms' )

	] )

};
