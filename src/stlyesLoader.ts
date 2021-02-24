import * as vm from 'vm';

import fetch from 'node-fetch';

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

  const config = url?.protocol?.startsWith('http')
    ? await loadViaHttp(path)
    : require(/* webpackIgnore: true */ path).default;

  if (!validateStyleConfig(config)) {
    throw new Error('Invalid style configuration');
  }

  return config;
}
