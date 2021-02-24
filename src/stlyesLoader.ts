import * as vm from 'vm';

import fetch from 'node-fetch';

import {logger} from './logging';
import {validateStyleConfig} from './validate';

/**
 * Load chart style configurations via an external javascript file
 */
async function loadViaHttp(path: string) {
  const resp = await fetch(path, {
    method: 'GET',
    headers: {Accepts: 'application/javascript'},
  });

  const configJavascript = await resp.text();
  logger.info(`Style config fetched from ${path}`);

  const exports = {default: null};
  vm.runInNewContext(configJavascript, {require, console, exports});

  return exports.default;
}

/**
 * Load external chart style configurations
 */
export async function resolveStylesConfig(path: string) {
  let url: URL | null = null;

  try {
    url = new URL(path);
  } catch {
    // Not a valid URL
  }

  const isHttpUrl = url?.protocol?.startsWith('http');
  logger.info(`Resolving style config via ${isHttpUrl ? 'HTTP' : 'provided file'}`);

  const config = isHttpUrl
    ? await loadViaHttp(path)
    : require(/* webpackIgnore: true */ path).default;

  const [styleConfig, errors] = validateStyleConfig(config);

  if (errors !== undefined) {
    throw new Error(errors?.message);
  }

  logger.info(`Style config valid. ${styleConfig.size} styles available.`);

  return styleConfig;
}
