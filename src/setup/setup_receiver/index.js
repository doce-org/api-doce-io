'use strict'; 
 
const memory = require('feathers-memory'); 
const hooks = require( './hooks' ); 
 
module.exports = function () { 
 
    const app = this; 
 
    // Initialize our service with any options it requires 
    app.use( '/setup/receivers', memory() ); 
 
    const setupService = app.service( '/setup/receivers' ); 
    setupService.before( hooks.before ); 
    setupService.after( hooks.after ); 
 
}; 