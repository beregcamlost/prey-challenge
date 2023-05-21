import { timeCalc } from './time.js';

describe('timeCalc', () => {
  it('should return formatted time string for valid input', () => {
    const input = 5025000;
    const expectedOutput = '45:23:01';
    const output = timeCalc(input);
    expect(output).toEqual(expectedOutput);
  });

  it('should return "00:00:00" for input value of 0', () => {
    const input = 0;
    const expectedOutput = '00:00:00';
    const output = timeCalc(input);
    expect(output).toEqual(expectedOutput);
  });

  it('should throw an error for negative input value', () => {
    const input = -1000;
    expect(() => {
      timeCalc(input);
    }).toThrow();
  });

  it('should throw an error for NaN input value', () => {
    const input = NaN;
    expect(() => {
      timeCalc(input);
    }).toThrow();
  });

  it('should throw an error for non-numeric input value', () => {
    const input = 'invalid input';
    expect(() => {
      timeCalc(input);
    }).toThrow();
  });

  it('should handle large input values', () => {
    const input = Number.MAX_SAFE_INTEGER;
    const expectedOutput = '12:42:55';
    const output = timeCalc(input);
    expect(output).toEqual(expectedOutput);
  });
});