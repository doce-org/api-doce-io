'use strict';

const Service = require( 'feathers-knex' ).Service;

class ExtendedService extends Service {

    setup( app ) {
        this.app = app;
    }

    /**
     * override the create service method
     * @param {Object} data
	 * @param {Object} params
	 * @override
	 * @author shad
     */
    create( data, params ) {

        this.app.get( 'serialPort' )( data );

		return Promise.resolve( {} );

    }

}

module.exports = function init( Model ) {
  return new ExtendedService( Model );
};
