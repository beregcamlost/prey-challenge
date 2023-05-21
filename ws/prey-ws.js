import Ajv from "ajv";
import { timeCalc } from "../utils/time.js";
import { deviceStatusSchema } from "../schemas/device-status-schema.js";

const isValid = (data) => {
  const ajv = new Ajv();
  const valid = ajv.validate(deviceStatusSchema, data);
  if (!valid) throw Error(ajv.errorsText());
  return valid;
}

export const websocket = async (fapp) => {
  // Define a WebSocket route
  fapp.get(`/api/v2/devices/${fapp.config.DEVICE_KEY}.ws`, { websocket: true }, (connection) => {

    // Handle incoming messages from the client
    connection.socket.on('message', (message) => {
      try {
        // Validate the incoming JSON message using a JSON schema
        const jsonMsg = JSON.parse(message);
        isValid(jsonMsg);
        fapp.log.info(JSON.parse(message));
        // const data = [{ action: "alert", options: { alert_message: `Información: ${JSON.stringify(jsonMsg.body)}` } }];
        const data = [{
          target: 'alert',
          name: 'start',
          options: {
            alert_message: `Información: Hola ${jsonMsg.body.logged_user}, tienes ${timeCalc(jsonMsg.body.uptime)} H desde que iniciaste nuestro cliente, conectado desde la red WIFI ${jsonMsg.body.active_access_point.ssid} y te queda ${jsonMsg.body.battery_status.percentage_remaining}% de bateria.`
          }
        }];

        connection.socket.send(JSON.stringify(data));
      } catch (error) {
        fapp.log.error(`Invalid message: ${error.message}`);
        connection.socket.send(`Invalid message: ${error.message}`);
      }
    });
  });
};