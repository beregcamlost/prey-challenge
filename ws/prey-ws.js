import Ajv from "ajv";
import { timeCalc } from "../utils/time.js";
import { deviceStatusSchema } from "../schemas/device-status-schema.js";

/**
 * Validates the given `data` against `deviceStatusSchema` using Ajv.
 * @param {Object} data - The JSON data to validate.
 * @returns {boolean} - `true` if the data is valid, `false` otherwise.
 * @throws Error - If the data is invalid, an error is thrown with the validation errors.
 */
const isValid = (data) => {
  const ajv = new Ajv();
  const valid = ajv.validate(deviceStatusSchema, data);
  if (!valid) throw Error(ajv.errorsText());
  return valid;
}

/**
 * Defines a WebSocket route for device status updates.
 * @param {Object} fapp - The Fastify app instance.
 * @returns {Promise<void>} - A promise that resolves when the WebSocket connection is closed.
 */
export const websocket = async (fapp) => {
  /** Define a WebSocket route */
  fapp.get(`/api/v2/devices/${fapp.config.DEVICE_KEY}.ws`, { websocket: true }, (connection) => {

    /** Handle incoming messages from the client */
    connection.socket.on('message', (message) => {
      try {
        /** Validate the incoming JSON message using a JSON schema */
        const jsonMsg = JSON.parse(message);
        isValid(jsonMsg);

        /** Log the incoming message */
        fapp.log.info(JSON.parse(message));

        /**
         * An array of objects containing information about an alert event.
         * @typedef {Object} AlertData
         * @property {string} target - The target of the alert event.
         * @property {string} name - The name of the event.
         * @property {Object} options - Additional options for the event.
         * @property {string} options.alert_message - The message to display in the alert.
         */
        const data = [{
          target: 'alert',
          name: 'start',
          options: {
            alert_message: `Información: Hola ${jsonMsg.body.logged_user}, tienes ${timeCalc(jsonMsg.body.uptime)} H desde que iniciaste nuestro cliente y estas conectado desde la red wifi ${jsonMsg.body.active_access_point.ssid} con ${jsonMsg.body.battery_status.percentage_remaining}% de bateria restante.`
          }
        }];

        /** Send the response message back to the client */
        connection.socket.send(JSON.stringify(data));
      } catch (error) {
        /** Log and send an error message if the incoming message is invalid */
        fapp.log.error(`Invalid message: ${error.message}`);
        connection.socket.send(`Invalid message: ${error.message}`);
      }
    });
  });
};