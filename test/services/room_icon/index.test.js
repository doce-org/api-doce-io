'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('room_icon service', function() {
  it('registered the room_icons service', () => {
    assert.ok(app.service('room_icons'));
  });
});
