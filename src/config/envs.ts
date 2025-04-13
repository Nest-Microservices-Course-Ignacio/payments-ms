import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  STRIPE_SECRET_KEY: string;
  API_GATEWAY: string;
  WEBHOOK_SECRET: string;
}

const envVarsSchema = joi
  .object<EnvVars>({
    PORT: joi.number().default(3000).optional(),
    STRIPE_SECRET_KEY: joi.string().required(),
    API_GATEWAY: joi.string().required(),
    WEBHOOK_SECRET: joi.string().required(),
  })
  .unknown(true)
  .required();

const result = envVarsSchema.validate(process.env);
const { error, value } = result as {
  error?: joi.ValidationError;
  value: EnvVars;
};

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}
export const envVars: EnvVars = value;
export const envs = {
  port: envVars.PORT,
  stripeSecretKey: envVars.STRIPE_SECRET_KEY,
  apiGateway: envVars.API_GATEWAY,/* TODO: change this */
  webhookSecret: envVars.WEBHOOK_SECRET,
};
