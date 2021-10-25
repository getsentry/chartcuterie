import Joi from 'joi';

import ConfigService from './config';
import {ChartcuterieConfig, RenderData} from './types';

const renderType = Joi.object({
  key: Joi.string().description('The lookup key used by render requests').required(),

  height: Joi.number()
    .description('The height of the rendered chart, in pixels')
    .required(),

  width: Joi.number()
    .description('The width of the rendered chart, in pixels')
    .required(),

  getOption: Joi.function()
    .description('Transforms a series into a valid Echarts option object')
    .required(),
});

const renderConfigSchema = Joi.object().pattern(Joi.string(), renderType);

const configSchema = Joi.object({
  renderConfig: renderConfigSchema,
  init: Joi.function(),
  version: Joi.string().description('Version of the configuration module').required(),
});

/**
 * Validate a style config object
 */
export function validateConfig(config: any) {
  const {error} = configSchema.validate(config);
  return [config as ChartcuterieConfig, error] as const;
}

/**
 * Validate render data
 */
export function validateRenderData(config: ConfigService, data: any) {
  const renderDataSchema = Joi.object({
    requestId: Joi.string()
      .description('Identifies the rendering request from the client')
      .required(),

    style: Joi.string()
      .description('Indicates what rendering style to use for the chart')
      .valid(...config.renderStyles)
      .required(),

    data: Joi.any(),
  });

  const {error} = renderDataSchema.validate(data);
  return [data as RenderData, error] as const;
}
