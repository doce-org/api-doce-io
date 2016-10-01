'use strict';

const assert = require('assert');
const populateSensors = require('../../../../src/services/room/hooks/populateSensors.js');

describe('room populateSensors hook', function() {
  it('hook can be used', function() {
    const mockHook = {
      type: 'after',
      app: {},
      params: {},
      result: {},
      data: {}
    };

    populateSensors()(mockHook);

    assert.ok(mockHook.populateSensors);
  });
});
