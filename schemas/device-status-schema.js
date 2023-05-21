/**
 * JSON schema for device status message.
 *
 * @typedef {object} DeviceStatusSchema
 * @property {'number'} level - The log level.
 * @property {'number'} pid - The process ID.
 * @property {'string'} hostname - The hostname.
 * @property {'string'} id - The device ID.
 * @property {'string'} type - The message type (default: 'device_status').
 * @property {object} body - The message body.
 * @property {number} body.uptime - The device uptime in seconds.
 * @property {string} body.logged_user - The name of the logged in user.
 * @property {object} body.battery_status - The device battery status.
 * @property {number} body.battery_status.percentage_remaining - The battery percentage remaining.
 * @property {string} body.battery_status.state - The battery state.
 * @property {string} body.battery_status.time_remaining - The battery time remaining.
 * @property {object} body.active_access_point - The active access point.
 * @property {string} body.active_access_point.ssid - The SSID of the access point.
 * @property {string} body.active_access_point.security - The security type of the access point.
 * @property {string} body.active_access_point.mac_address - The MAC_address of the access point.
 * @property {number} body.active_access_point.signal_strength - The signal strength of the access point.
 * @property {number} body.active_access_point.channel - The channel of the access point.
 *
 * @type {object}
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
            percentage_remaining: { type: 'number' },
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