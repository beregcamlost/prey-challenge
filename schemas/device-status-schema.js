/**
JSDoc for deviceStatusSchema
@type {object}
@property {string} type - The type of the schema (object).
@property {object} properties - The properties of the schema.
@property {number} properties.level - The level property of the schema (number).
@property {number} properties.pid - The pid property of the schema (number).
@property {string} properties.hostname - The hostname property of the schema (string).
@property {string} properties.id - The id property of the schema (string).
@property {string} properties.type - The type property of the schema (string). Default value is 'device_status'.
@property {object} properties.body - The body property of the schema (object).
@property {integer} properties.body.uptime - The uptime property of the body (integer).
@property {string} properties.body.logged_user - The logged_user property of the body (string).
@property {object} properties.body.battery_status - The battery_status property of the body (object).
@property {(integer|string)} properties.body.battery_status.percentage_remaining - The percentage_remaining property of the battery_status (integer or string).
@property {string} properties.body.battery_status.state - The state property of the battery_status (string).
@property {string} properties.body.battery_status.time_remaining - The time_remaining property of the battery_status (string).
@property {object} properties.body.active_access_point - The active_access_point property of the body (object).
@property {string} properties.body.active_access_point.ssid - The ssid property of the active_access_point (string).
@property {string} properties.body.active_access_point.security - The security property of the active_access_point (string).
@property {string} properties.body.active_access_point.mac_address - The mac_address property of the active_access_point (string).
@property {integer} properties.body.active_access_point.signal_strength - The signal_strength property of the active_access_point (integer).
@property {integer} properties.body.active_access_point.channel - The channel property of the active_access_point (integer).
@property {Array<string>} properties.required - The required properties of the schema.
@property {Array<string>} properties.body.required - The required properties of the body.
@property {Array<string>} required - The required properties of the schema.
*/
export const deviceStatusSchema = {
  type: 'object',
  properties: {
    level: { type: 'number' },
    pid: { type: 'number' },
    hostname: { type: 'string' },
    id: { type: 'string' },
    type: { type: 'string', default: 'device_status' },
    body: {
      type: 'object',
      properties: {
        uptime: { type: 'integer' },
        logged_user: { type: 'string' },
        battery_status: {
          type: 'object',
          properties: {
            percentage_remaining: { type: ["integer", "string"] },
            state: { type: 'string' },
            time_remaining: { type: 'string' },
          },
          required: ['percentage_remaining', 'state', 'time_remaining'],
        },
        active_access_point: {
          type: 'object',
          properties: {
            ssid: { type: 'string' },
            security: { type: 'string' },
            mac_address: { type: 'string' },
            signal_strength: { type: 'integer' },
            channel: { type: 'integer' },
          },
          required: ['ssid', 'security', 'mac_address', 'signal_strength', 'channel'],
        },
      },
      required: ['uptime', 'logged_user', 'battery_status', 'active_access_point'],
    },
  },
  required: ['id', 'type', 'body']
};