import {RenderData, StyleConfig} from './types';

/**
 * Validate a style config object
 */
export function validateStyleConfig(config: any): config is StyleConfig {
  // TODO implement validation
  return typeof config === 'object';
}

/**
 * Validate render data
 */
export function validateRenderData(data: any): data is RenderData {
  // TODO implement validation
  return typeof data === 'object';
}
