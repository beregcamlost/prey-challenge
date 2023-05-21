import fastify from 'fastify';
import fastifyWebsocket from '@fastify/websocket';
import fastifyEnv from '@fastify/env';
import { websocket } from './ws/prey-ws.js';
import { envSchema } from './schemas/env/env-schema.js';


/**
 * The Fastify application instance.
 * @type {import('fastify').FastifyInstance}
 */
const fapp = fastify(
  /**
  * Property for active PinologgerOptions
  * @property {boolean} logger
  */
  { logger: true }
);

/**
 * The options object used to configure the environment plugin.
 * @type {object}
 * @property {string} confKey - The key to use for the configuration object in the Fastify instance.
 * @property {import('@fastify/env').FastifyEnvSchema} schema - The schema used to validate environment variables.
 * @property {boolean} dotenv - Whether to load environment variables from a .env file.
 * @property {NodeJS.ProcessEnv} data - The current environment variables.
 */
const options = {
  confKey: 'config',
  schema: envSchema,
  dotenv: true,
  data: process.env
};

/** Register the env plugin */
await fapp.register(fastifyEnv, options);
await fapp.after();

/** Register the WebSocket plugin */
fapp.register(fastifyWebsocket);

/** Register the WebSocket route */
fapp.register(websocket, {
  /**
   * The options object used to configure the WebSocket plugin.
   * @type {object}
   * @property {number} maxPayload - The maximum size of an incoming message in bytes.
   * @property {string} path - The WebSocket path to match for incoming connections.
   * @property {function(object, function)} verifyClient - A function that verifies the client connection before accepting it.
   */
  options: {
    /** set the maximum allowed message size to 1 MiB */
    maxPayload: 1048576,
    /** only accept connections that match this path */
    path: `/api/v2/devices/${fapp.config.DEVICE_KEY}.ws`,
    /** verificlient fn for check the incoming connection and decide is let it continue or not */
    verifyClient: function (info, next) {
      /**
       * The encoded API key to compare with the authorization header.
       * @type {string}
       */
      const encodedApikey = Buffer.from(fapp.config.API_KEY).toString('base64');
      if (info.req.headers.authorization !== `Basic Basic ${encodedApikey}}`) {
        /**
         * Reject the incoming connection.
         */
        return next(false);
      }
      /**
       * Accept the incoming connection.
       */
      next(true);
    }
  }
});

// Start the server and listen for incoming connections
/**
 * Starts the Fastify server and listens for incoming connections.
 * @returns {Promise<void>}
 */
const start = async () => {
  try {
    /**
     * The port number on which to listen for incoming connections.
     * @type {number}
     */
    const port = fapp.config.PORT;
    /**
     * Wait for all plugins to be loaded before starting the server.
     */
    await fapp.ready();
    /**
     * Listen for incoming connections on the specified port.
     */
    await fapp.listen({ port });
    /**
     * Log a message indicating that the server is now listening for incoming connections.
     */
    fapp.log.info(`Server listening on port ${port}`);
  } catch (err) {
    /**
     * Log an error message and exit the process if the server fails to start.
     * @param {Error} err - The error object that caused the server startup failure.
     */
    fapp.log.error(err);
    process.exit(1);
  }
};

start();