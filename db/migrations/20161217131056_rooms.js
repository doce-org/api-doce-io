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
		} ),

        knex.schema.table( 'hardwares', table => {
            table.integer( 'room_id' ).notNullable().references( 'id' ).inTable( 'rooms' );
        } )

	] );

};

exports.down = function( knex, Promise ) {

	return Promise.all( [

        knex.schema.table( 'hardwares' ).dropColumn( 'room_id' ),
		knex.schema.dropTable( 'rooms' )

	] )

};
