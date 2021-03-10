import * as vm from 'vm';

import fetch from 'node-fetch';

import {logger} from './logging';
import {RenderConfig, RenderDescriptor} from './types';
import {validateConfig} from './validate';

/**
 * Marker for when we haven't yet loaded a configuration
 */
export const NO_VERSION = Symbol('awaiting-configuration');

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
  #renderConfig: RenderConfig = new Map();

  /**
   * Indicates the version of the last configuration file we've loaded. This
   * may be null if a configuration file has not been loaded yet.
   */
  #currentVersion: string | null = null;

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

    const [validConfig, errors] = validateConfig(config);

    if (errors !== undefined) {
      throw new Error(errors?.message);
    }

    logger.info(
      `Render config valid. ${validConfig.renderConfig.size} styles available.`
    );

    this.#currentVersion = validConfig.version;
    this.#renderConfig = validConfig.renderConfig;
  }

  /**
   * Set a specific configuration for rendering. Primarily used for testing.
   *
   * @internal
   */
  setRenderConfig(style: string, config: RenderDescriptor) {
    this.#renderConfig.set(style, config);
  }

  /**
   * Set the current config version. Primarily used for testing.
   *
   * @internal
   */
  setVersion(version: string) {
    this.#currentVersion = version;
  }

  /**
   * Get a render style configuration given the style key
   */
  getConfig(style: string) {
    return this.#renderConfig.get(style);
  }

  /**
   * Get the list of available render style configurations
   */
  get renderStyles() {
    return this.#renderConfig.keys();
  }

  /**
   * Checks that we have loaded a configuration file
   */
  get isLoaded() {
    return this.#currentVersion !== null;
  }

  /**
   * Get the current configuration version
   */
  get version() {
    return this.#currentVersion ?? NO_VERSION;
  }
}
