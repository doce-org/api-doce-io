'use strict';

const hooks = require( 'feathers-hooks' );
const hardware = require( '../../../hooks/hardwares' );

exports.before = {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [
        hooks.disable()
    ],
    patch: [
        hooks.disable()
    ],
    remove: []
};

exports.after = {
    all: [],
    find: [],
    get: [],
    create: [
        hardware.removePairedHardware()
    ],
    update: [],
    patch: [],
    remove: []
};
