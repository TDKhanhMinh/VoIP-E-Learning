import Joi from 'joi';

const booleanEnvironmentValue = Joi.boolean().truthy('true').falsy('false');
const phase00LockedOffIntegration = booleanEnvironmentValue
  .valid(false)
  .default(false);

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
  SWAGGER_ENABLED: booleanEnvironmentValue.default(false),
  V1_COMPATIBILITY_ADAPTER_ENABLED: booleanEnvironmentValue
    .valid(false)
    .default(false),
  MONGO_ENABLED: booleanEnvironmentValue.default(false),
  MONGO_URI: Joi.when('MONGO_ENABLED', {
    is: true,
    then: Joi.string()
      .uri({ scheme: ['mongodb', 'mongodb+srv'] })
      .required(),
    otherwise: Joi.string().allow('').optional(),
  }),
  MONGO_AUTO_INDEX: booleanEnvironmentValue.default(false),
  JWT_ACCESS_SECRET: Joi.when('NODE_ENV', {
    is: 'production',
    then: Joi.string().min(32).required(),
    otherwise: Joi.string()
      .min(32)
      .default('development-access-secret-not-for-production-12345'),
  }),
  JWT_REFRESH_SECRET: Joi.when('NODE_ENV', {
    is: 'production',
    then: Joi.string().min(32).required(),
    otherwise: Joi.string()
      .min(32)
      .default('development-refresh-secret-not-for-production-12345'),
  }),
  JWT_ISSUER: Joi.string().default('voip-elearning-api'),
  JWT_AUDIENCE: Joi.string().default('voip-elearning-client'),
  JWT_ACCESS_TOKEN_TTL: Joi.string().default('15m'),
  JWT_REFRESH_TOKEN_TTL: Joi.string().default('30d'),
  GOOGLE_OAUTH_ENABLED: phase00LockedOffIntegration,
  GOOGLE_DRIVE_ENABLED: phase00LockedOffIntegration,
  CLOUDINARY_ENABLED: phase00LockedOffIntegration,
  LIVEKIT_ENABLED: phase00LockedOffIntegration,
  SMTP_ENABLED: phase00LockedOffIntegration,
  RECORDING_ENABLED: phase00LockedOffIntegration,
  AWS_RECORDING_ENABLED: phase00LockedOffIntegration,
  GEMINI_ENABLED: phase00LockedOffIntegration,
  SIP_ENABLED: phase00LockedOffIntegration,
}).unknown(true);
