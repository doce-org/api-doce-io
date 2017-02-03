'use strict';

const utils = require( 'feathers-hooks-common/lib/utils' );
const _ = require( 'lodash' );
const usb = require( 'usb' );

/**
 * list connected usb ports
 * @return {Promise}
 * @author shad
 */
exports.listConnectedsSerialPorts = function() {

    return function( hook ) {

        utils.checkContext( hook, 'before', [ 'find' ], 'listConnectedsSerialPorts' );

        if( hook.params.query.listConnectedsSerialPorts ) {

            return new Promise( ( resolve, reject ) => {
				let results = [];

				/**
				 * get descriptions strings for better reading client side
				 *
				 * @param  {Object} device
				 *
				 * @return {Promise}
				 *
				 * @author shad
				 */
				const getDescriptors = ( device ) => {
					if( device.deviceDescriptor.iManufacturer === 0 ) {
						return;
					}
					return new Promise( resolve => {
						device.open();
						device.getStringDescriptor( device.deviceDescriptor.iManufacturer, ( err, res ) => {
							device.manufacturer = res;
							device.getStringDescriptor( device.deviceDescriptor.iProduct, ( err, res ) => {
								device.product = res;
								device.getStringDescriptor( device.deviceDescriptor.iSerialNumber, ( err, res ) => {
									device.serial_number = res;
									device.close();
									resolve( device );
								} )
							} )
						} )
					} );
				};

				const devices = usb.getDeviceList();
				const mapped_promises = devices.map( getDescriptors );
				return Promise.all( mapped_promises ).then( res => {
					res = _.omitBy( res,  _.isNull );
					hook.result = res;
					resolve( hook );
				} );
            } );

        }

    };

};
