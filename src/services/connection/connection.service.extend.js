'use strict';

const Service = require( 'feathers-knex' ).Service;

class ExtendedService extends Service {

    setup( app ) {
        this.app = app;
    }

    /**
     * override the create service method to provide the
     * possibility to open the serial port connection
     * 
	 * @override
     * 
	 * @author shad
     */
    create() {

        // open the serial port
        this.app.get( 'serialPort' ).open();

		return Promise.resolve( {} );

    }

    /**
     * override the remove service method to provide the
     * possibility to close the serial port connection
     * 
     * @override
     * 
     * @author shad
     */
    remove() {

        // close the serial port
        this.app.get( 'serialPort' ).close();

        return Promise.resolve( {} );

    }

}

module.exports = function init( Model ) {
  return new ExtendedService( Model );
};
