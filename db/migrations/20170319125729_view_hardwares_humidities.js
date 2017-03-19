'use strict';

const fs = require( 'fs' );
const sql_folder = '20170319125729_view_hardwares_humidities';

const create_view_hardwares_humdities = fs.readFileSync(
	`${__dirname}/../sql/${sql_folder}/views/create_view_hardwares_humidities.sql` ).toString();

exports.up = function( knex, Promise ) {

	return Promise.all( [

		knex.schema.raw( create_view_hardwares_humdities )

	] );

};

exports.down = function( knex, Promise ) {

	return Promise.all( [

		knex.schema.raw( 'DROP VIEW IF EXISTS hardwares_humidities;' )

	] );

};
