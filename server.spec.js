import fastify from 'fastify';
import fastifyWebsocket from '@fastify/websocket';
import fastifyEnv from '@fastify/env';
import { websocket } from './ws/prey-ws.js';
import { envSchema } from './schemas/env/env-schema.js';

describe('WebSocket server', () => {
  let fapp;

  beforeAll(async () => {
    fapp = fastify({ logger: true });

    const options = {
      confKey: 'config',
      schema: envSchema,
      dotenv: true,
      data: process.env
    };

    await fapp.register(fastifyEnv, options);
    await fapp.after();

    fapp.register(fastifyWebsocket);

    fapp.register(websocket, {
      options: {
        maxPayload: 1048576,
        path: `/api/v2/devices/${fapp.config.DEVICE_KEY}.ws`,
        verifyClient: function (info, next) {
          const encodedApikey = Buffer.from(fapp.config.API_KEY).toString('base64');
          if (info.req.headers.authorization !== `Basic Basic ${encodedApikey}}`) {
            return next(false);
          }
          next(true);
        }
      }
    });
  });

  afterAll(async () => {
    await fapp.close();
  });

  it('should start the server without errors', async () => {
    const port = fapp.config.PORT;
    await expect(fapp.listen({ port })).resolves.not.toThrow();
  });

  it('should reject incoming connections with invalid authorization', async () => {
    const client = new WebSocket(`ws://localhost:${fapp.config.PORT}/api/v2/devices/${fapp.config.DEVICE_KEY}.ws`);
    client.on('open', () => {
      client.send('Hello, server!');
    });
    await new Promise((resolve) => {
      client.on('close', (code, reason) => {
        expect(code).toBe(1008);
        expect(reason).toBe('Policy violation');
        resolve();
      });
    });
  });

  it('should accept incoming connections with valid authorization', async () => {
    const encodedApikey = Buffer.from(fapp.config.API_KEY).toString('base64');
    const client = new WebSocket(`ws://localhost:${fapp.config.PORT}/api/v2/devices/${fapp.config.DEVICE_KEY}.ws`, {
      headers: { Authorization: `Basic Basic ${encodedApikey}` }
    });
    await new Promise((resolve) => {
      client.on('open', () => {
        client.send('Hello, server!');
      });
      client.on('message', (data) => {
        expect(data).toBe('Hello, client!');
        client.close();
      });
      client.on('close', (code, reason) => {
        expect(code).toBe(1000);
        expect(reason).toBe('WebSocket connection closed');
        resolve();
      });
    });
  });
});