import * as vm from 'vm';

import fetch from 'node-fetch';

import {logger} from './logging';
import {RenderConfig, RenderDescriptor} from './types';
import {validateRenderConfig} from './validate';

/**
 * Load chart render configurations via an external javascript file
 */
async function loadViaHttp(path: string) {
  const resp = await fetch(path, {
    method: 'GET',
    headers: {Accepts: 'application/javascript'},
  });

  const configJavascript = await resp.text();

  logger.info(`Render config fetched from ${path}`);

  const exports = {default: null};
  const module = {exports};
  vm.runInNewContext(configJavascript, {require, console, module, exports});

  return exports.default ?? module.exports;
}

/**
 * Service to manage resolving the external chart configuration module.
 */
export default class ConfigService {
  /**
   * The path / url to load the render configuration from
   */
  #uri = '';

  /**
   * The resolved render configuration
   */
  #config: RenderConfig = new Map();

  constructor(path: string) {
    this.#uri = path;
  }

  async resolve() {
    let url: URL | null = null;

    try {
      url = new URL(this.#uri);
    } catch {
      // Not a valid URL
    }

    const isHttpUrl = url?.protocol?.startsWith('http');
    logger.info(`Resolving render config via ${isHttpUrl ? 'HTTP' : 'provided file'}`);

    const config = isHttpUrl
      ? await loadViaHttp(this.#uri)
      : require(/* webpackIgnore: true */ this.#uri).default;

    const [renderConfig, errors] = validateRenderConfig(config);

    if (errors !== undefined) {
      throw new Error(errors?.message);
    }

    logger.info(`Render config valid. ${renderConfig.size} styles available.`);

    this.#config = renderConfig;
  }

  setConfig(style: string, config: RenderDescriptor) {
    this.#config.set(style, config);
  }

  /**
   * Get a render style configuration given the style key
   */
  getConfig(style: string) {
    return this.#config.get(style);
  }

  /**
   * Get the list of available render style configurations
   */
  renderStyles() {
    return this.#config.keys();
  }
}
