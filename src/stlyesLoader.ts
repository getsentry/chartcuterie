import {validateStyleConfig} from './validate';

/**
 * Load external style configurations
 */
export function stylesConfigLoader(path: string) {
  const config = require(/* webpackIgnore: true */ path).default;

  if (!validateStyleConfig(config)) {
    throw new Error('Invalid style configuration');
  }

  return config;
}
