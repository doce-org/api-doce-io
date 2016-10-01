'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('sensor_data service', function() {
  it('registered the sensor_data service', () => {
    assert.ok(app.service('sensor_data'));
  });
});
