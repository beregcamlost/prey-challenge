const Ajv = require('ajv');
import deviceStatusSchema from './device-status-schema.js';

describe('deviceStatusSchema', () => {
  let ajv;

  beforeAll(async () => {
    ajv = new Ajv();
  });
  it('should validate a valid device status message', () => {
    const validMessage = {
      level: 1,
      pid: 123,
      hostname: 'example.com',
      id: 'device-123',
      body: {
        uptime: 3600,
        logged_user: 'john.doe',
        battery_status: {
          percentage_remaining: 80,
          state: 'charging',
          time_remaining: '2 hours',
        },
        active_access_point: {
          ssid: 'MyWiFi',
          security: 'WPA2',
          mac_address: '12:34:56:78:90:AB',
          signal_strength: -50,
          channel: 6,
        },
      },
    };

    const valid = ajv.validate(deviceStatusSchema, validMessage);
    expect(valid).toBe(true);
  });

  it('should not validate an invalid device status message', () => {
    const invalidMessage = {
      level: 'info',
      pid: 'abc',
      hostname: 123,
      id: null,
      body: {
        uptime: '1 hour',
        logged_user: 'john.doe',
        battery_status: {
          percentage_remaining: 120,
          state: 'charging',
          time_remaining: 120,
        },
        active_access_point: {
          ssid: 'MyWiFi',
          security: 'WPA2',
          mac_address: '12:34:56:78:90:AB',
          signal_strength: -50,
          channel: 6,
        },
      },
    };
    const valid = ajv.validate(deviceStatusSchema, invalidMessage);
    expect(valid).toBe(false);
  });
});
