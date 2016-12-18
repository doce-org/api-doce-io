'use strict';

const utils = require( 'feathers-common-hooks/lib/utils' );
const serial = require( 'serialport' );

/**
 * list connected serial ports
 * @return {Promise}
 * @author shad
 */
exports.listConnectedsSerialPorts = function() {

    return function( hook ) {

        utils.checkContext( 'before', [ 'find' ], 'listConnectedsSerialPorts' );

        if( hook.params.query.listConnectedsSerialPorts ) {

            return new Promise( ( resolve, reject ) => {

                serial.list( ( err, res ) => {
                    if( err ) {
                        reject( err );
                    }

                    hook.result = res;
                    resolve( hook );
                } );

            } );

        }

    };

};
