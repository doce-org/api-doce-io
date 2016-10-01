'use strict';

const app = require( './app' );
const port = app.get( 'port' );
const server = app.listen( port );

//require('./plugins/serialport');

server.on( 'listening', () =>
    console.log( `DOCE server application started on ${app.get( 'host' )}:${port}` )
);