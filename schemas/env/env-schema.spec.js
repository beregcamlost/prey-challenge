import { envSchema } from './env-schema.js';

describe('envSchema', () => {
  it('should have the required properties', () => {
    expect(envSchema.required).toContain('PORT');
  });

  it('should have the correct property types', () => {
    expect(envSchema.properties).toHaveProperty('PORT');
    expect(envSchema.properties.PORT.type).toBe('number');

    expect(envSchema.properties).toHaveProperty('DEVICE_KEY');
    expect(envSchema.properties.DEVICE_KEY.type).toBe('string');

    expect(envSchema.properties).toHaveProperty('API_KEY');
    expect(envSchema.properties.API_KEY.type).toBe('string');
  });

  it('should have the correct default value', () => {
    expect(envSchema.properties).toHaveProperty('PORT');
    expect(envSchema.properties.PORT.default).toBe(4000);
  });
});
