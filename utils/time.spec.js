import moment from 'moment';
import { timeCalc } from './time.js';

jest.mock('moment', () => {
  const originalMoment = jest.requireActual('moment');
  const mockedDuration = {
    asHours: jest.fn().mockReturnValue(1),
    minutes: jest.fn().mockReturnValue(23),
    seconds: jest.fn().mockReturnValue(45),
  };
  const mockedMoment = {
    duration: jest.fn().mockReturnValue(mockedDuration),
  };
  return {
    ...originalMoment,
    default: jest.fn().mockReturnValue(mockedMoment),
  };
});

describe('timeCalc', () => {
  test('returns the formatted time string for a given time value', () => {
    const result = timeCalc(5025000);
    expect(result).toBe('1:23:45');
  });
});
