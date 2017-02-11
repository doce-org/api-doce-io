'use strict';

const hooks = require( 'feathers-hooks' );
const port = require( './hooks' );

exports.before = {
    all: [],
    find: [
		port.listSerialPorts()
	],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
};

exports.after = {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
};
