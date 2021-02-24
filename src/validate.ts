import Joi from 'joi';

import {RenderData, StyleConfig} from './types';

const styleSchema = Joi.object({
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

const styleConfigSchema = Joi.object().pattern(Joi.string(), styleSchema);

/**
 * Validate a style config object
 */
export function validateStyleConfig(config: any) {
  const {error} = styleConfigSchema.validate(config);
  return [config as StyleConfig, error] as const;
}

/**
 * Validate render data
 */
export function validateRenderData(styleConfig: StyleConfig, data: any) {
  const renderDataSchema = Joi.object({
    requestId: Joi.string()
      .description('Identifies the rendering request from the client')
      .required(),

    style: Joi.string()
      .description('Indicates what rendering style to use for the chart')
      .allow(styleConfig.keys())
      .required(),

    // We don't try too hard to validate series
    series: Joi.array().items(Joi.object({data: Joi.array()}).unknown(true)),
  });

  const {error} = renderDataSchema.validate(data);
  return [data as RenderData, error] as const;
}
