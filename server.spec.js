import fastify from 'fastify';
import fastifyWebsocket from '@fastify/websocket';
import fastifyEnv from '@fastify/env';
import { websocket } from './ws/prey-ws.js';
import { envSchema } from './schemas/env/env-schema.js';

jest.mock('fastify');
jest.mock('@fastify/websocket');
jest.mock('@fastify/env');
jest.mock('./ws/prey-ws.js');
jest.mock('./schemas/env/env-schema.js');

import { start } from './server.js';

describe('start', () => {
  let fapp;
  const config = {
    PORT: 3000,
    DEVICE_KEY: 'your-device-key',
    API_KEY: 'your-api-key'
  };

  beforeAll(() => {
    fapp = {
      config,
      register: jest.fn(),
      after: jest.fn(),
      ready: jest.fn(),
      listen: jest.fn(),
      log: {
        info: jest.fn(),
        error: jest.fn()
      }
    };

    fastify.mockReturnValue(fapp);

    fastifyEnv.mockImplementation(async (app, options) => {
      app.config = config;
    });

    // Mock the WebSocket plugin
    fastifyWebsocket.mockImplementation(() => {});

    // Mock the WebSocket route
    websocket.mockImplementation(() => {});

    // Call the start function
    start();
  });

  afterAll(() => {
    // Restore the original implementations
    jest.restoreAllMocks();
  });

  it('should create a Fastify instance with the logger option', () => {
    expect(fastify).toHaveBeenCalledWith({ logger: true });
  });

  it('should register the env plugin with the correct options', () => {
    expect(fapp.register).toHaveBeenCalledWith(fastifyEnv, {
      confKey: 'config',
      schema: envSchema,
      dotenv: true,
      data: process.env
    });
  });

  it('should register the WebSocket route with the correct options', () => {
    expect(fapp.register).toHaveBeenCalledWith(websocket, {
      options: {
        maxPayload: 1048576,
        path: `/api/v2/devices/${config.DEVICE_KEY}.ws`,
        verifyClient: expect.any(Function)
      }
    });
  });

  it('should call the ready method', () => {
    expect(fapp.ready).toHaveBeenCalled();
  });

  it('should call the listen method with the correct port', () => {
    expect(fapp.listen).toHaveBeenCalledWith({ port: config.PORT });
  });

  it('should log a message indicating that the server is listening', () => {
    expect(fapp.log.info).toHaveBeenCalledWith(`Server listening on port ${config.PORT}`);
  });

  it('should log an error and exit the process if the server fails to start', async () => {
    const error = new Error('Server startup failed');
    fapp.listen.mockRejectedValueOnce(error);

    start();

    expect(fapp.log.error).toHaveBeenCalledWith(error);
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  it('should reject the incoming connection if the authorization header is incorrect', () => {
    const verifyClient = fapp.register.mock.calls[1][1].options.verifyClient;
    const next = jest.fn();

    const info = {
      req: {
        headers: {
          authorization: 'InvalidAuthorizationHeader'
        }
      }
    };

    verifyClient(info, next);

    expect(next).toHaveBeenCalledWith(false);
  });

  it('should accept the incoming connection if the authorization header is correct', () => {
    const verifyClient = fapp.register.mock.calls[1][1].options.verifyClient;
    const next = jest.fn();

    const encodedApiKey = Buffer.from(config.API_KEY).toString('base64');
    const info = {
      req: {
        headers: {
          authorization: `Basic Basic ${encodedApiKey}`
        }
      }
    };

    verifyClient(info, next);

    expect(next).toHaveBeenCalledWith(true);
  });
});
