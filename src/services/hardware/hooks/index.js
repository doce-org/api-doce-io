'use strict';

const hooks = require( 'feathers-hooks' );
const hardware = require( './hooks' );

exports.before = {
    all: [],
    find: [],
    get: [],
    create: [
		hardware.generateNodeID()
	],
    update: [],
    patch: [],
    remove: []
};

exports.after = {
    all: [],
    find: [],
    get: [],
    create: [
		hardware.notifyArduino()
	],
    update: [],
    patch: [],
    remove: []
};
