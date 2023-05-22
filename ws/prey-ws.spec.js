import Ajv from 'ajv';
import { websocket } from './prey-ws.js';

jest.mock('ajv');

describe('websocket', () => {
  let mockFastify;
  let mockSocket;
  let mockLogInfo;
  let mockErrorsText;

  beforeEach(() => {
    mockFastify = {
      get: jest.fn().mockReturnThis(),
      log: {
        info: jest.fn(),
        error: jest.fn(),
      },
      config: {
        DEVICE_KEY: 'device_key',
      },
    };

    mockSocket = {
      on: jest.fn(),
      send: jest.fn(),
    };

    mockLogInfo = mockFastify.log.info;
    mockErrorsText = jest.fn();

    Ajv.mockImplementation(() => ({
      validate: jest.fn().mockReturnValue(true),
      errorsText: mockErrorsText,
    }));

  });

  test('handles incoming valid message and sends response', () => {
    const mockConnection = {
      socket: mockSocket,
    };

    const message = JSON.stringify({
      body: {
        logged_user: 'John',
        uptime: 5000,
        active_access_point: {
          ssid: 'WiFi Network',
        },
        battery_status: {
          percentage_remaining: 50,
        },
      },
    });

    websocket(mockFastify);

    expect(mockFastify.get).toHaveBeenCalledWith(
      '/api/v2/devices/device_key.ws',
      { websocket: true },
      expect.any(Function)
    );

    const routeHandler = mockFastify.get.mock.calls[0][2];

    routeHandler(mockConnection);

    expect(mockSocket.on).toHaveBeenCalledWith('message', expect.any(Function));

    const messageHandler = mockSocket.on.mock.calls[0][1];

    messageHandler(message);

    expect(mockLogInfo).toHaveBeenCalledWith(JSON.parse(message));
    expect(mockFastify.log.info).toHaveBeenCalledTimes(1);
    expect(mockFastify.log.error).not.toHaveBeenCalled();
  });
});
