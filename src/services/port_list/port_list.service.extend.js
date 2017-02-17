'use strict';

const Service = require( 'feathers-knex' ).Service;
const errors = require( 'feathers-errors' );
const serialPort = require( 'serialport' );

class ExtendedService extends Service {

	/**
	 * setup extended service
	 *
	 * @author shad
	 */
    setup( app ) {
        this.app = app;
    }

	/**
	 * override original find method to implement serial port listing of available ports
	 *
	 * @param {Object} params
	 *
	 * @override
	 *
	 * @author shad
	 */
	find( params ) {

		return new Promise( ( resolve, reject ) => {

			// list the available serial port
			// in docker, those are mounted from the host path /dev/t*
			serialPort.list( function ( err, ports ) {

				if( err ) {
					throw new errors.BadRequest( `There was an error listing the available ports: ${err}` );
				}

				resolve( ports );

			} );

		} );

	}

}

module.exports = function init( Model ) {
  return new ExtendedService( Model );
};
