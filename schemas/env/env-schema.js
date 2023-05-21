export const envSchema = {
  type: 'object',
  required: ['PORT'],
  properties: {
    PORT: {
      type: 'number',
      default: 4000
    },
    DEVICE_KEY: {
      type: 'string'
    },
    API_KEY: {
      type: 'string'
    }
  }
}