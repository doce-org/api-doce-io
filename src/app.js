'use strict';

const path = require( 'path' );
const serveStatic = require( 'feathers' ).static;
const compress = require( 'compression' );
const cors = require( 'cors' );
const feathers = require( 'feathers' );
const configuration = require( 'feathers-configuration' );
const hooks = require( 'feathers-hooks' );
const bodyParser = require( 'body-parser' );
const rest = require( 'feathers-rest' );
const socketio = require( 'feathers-socketio' );
const middleware = require( './middleware' );
const services = require( './services' );
const views = require( './views' );
const serial = require( './plugins/serialport' );
const cron = require( './plugins/cron' );

const app = feathers();

app.configure( configuration( path.join( __dirname, '..' ) ) );

app.use( compress() )
    .options( '*', cors() )
    .use( cors() )
    .use( bodyParser.json() )
    .use( bodyParser.urlencoded( { extended: true } ) )
    .use( '/', serveStatic( app.get( 'public' ) ) )
    .configure( hooks() )
    .configure( rest() )
    .configure( socketio() )
    .configure( services )
    .configure( views )
    .configure( middleware )
    .configure( serial );
    //.configure( cron );

module.exports = app;
