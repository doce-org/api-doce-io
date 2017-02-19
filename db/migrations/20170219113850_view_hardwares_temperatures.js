'use strict';

const fs = require( 'fs' );
const sql_folder = '20170219113850_view_hardwares_temperatures';

const create_view_hardwares_temperatures = fs.readFileSync(
	`${__dirname}/../sql/${sql_folder}/views/create_view_hardwares_temperatures.sql` ).toString();

exports.up = function( knex, Promise ) {

	return Promise.all( [

		knex.schema.raw( create_view_hardwares_temperatures )

	] );

};

exports.down = function( knex, Promise ) {

	return Promise.all( [

		knex.schema.raw( 'DROP VIEW IF EXISTS hardwares_temperatures;' )

	] );

};
