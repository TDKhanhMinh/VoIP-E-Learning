import Joi from 'joi';

const booleanEnvironmentValue = Joi.boolean().truthy('true').falsy('false');

export const environmentValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),
  HOST: Joi.string().hostname().default('0.0.0.0'),
  PORT: Joi.number().port().default(3000),
  API_PREFIX: Joi.string()
    .pattern(/^[a-zA-Z0-9_-]+$/)
    .default('api'),
  API_VERSION: Joi.string().pattern(/^\d+$/).default('1'),
  CORS_ORIGINS: Joi.string().default(
    'http://localhost:5173,http://localhost:5174',
  ),
  BODY_LIMIT: Joi.string()
    .pattern(/^\d+(kb|mb)$/i)
    .default('2mb'),
  TRUST_PROXY: booleanEnvironmentValue.default(false),
  LOG_LEVEL: Joi.string()
    .valid('fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent')
    .default('info'),
  RATE_LIMIT_TTL_MS: Joi.number().integer().min(1000).default(60000),
  RATE_LIMIT_MAX: Joi.number().integer().min(1).default(100),
  MONGO_ENABLED: booleanEnvironmentValue.default(false),
  MONGO_URI: Joi.when('MONGO_ENABLED', {
    is: true,
    then: Joi.string()
      .uri({ scheme: ['mongodb', 'mongodb+srv'] })
      .required(),
    otherwise: Joi.string().allow('').optional(),
  }),
  MONGO_AUTO_INDEX: booleanEnvironmentValue.default(false),
  SIP_ENABLED: booleanEnvironmentValue.default(false),
  AWS_RECORDING_ENABLED: booleanEnvironmentValue.default(false),
}).unknown(true);
