import * as echarts from 'echarts';
import path from 'node:path';
import vm from 'node:vm';

import ConfigPoller from './configPolling';
import {logger} from './logging';
import {InitFn, PollingConfig, RenderConfig, RenderDescriptor} from './types';
import {validateConfig} from './validate';

/**
 * Marker for when we haven't yet loaded a configuration
 */
export const NO_VERSION = Symbol('awaiting-configuration');

/**
 * Load chart render configurations via an external javascript file
 */
async function loadViaHttp(url: string, ac?: AbortController) {
  const resp = await fetch(url, {
    method: 'GET',
    headers: {Accepts: 'application/javascript'},
    signal: ac?.signal,
  });

  const configJavascript = await resp.text();

  const exports = {default: null};
  const module = {exports};
  vm.runInNewContext(configJavascript, {require, console, module, exports});

  return exports.default ?? module.exports?.default ?? module.exports;
}

/**
 * Service to manage resolving the external chart configuration module.
 */
export default class ConfigService {
  /**
   * The path / uri to load the render configuration from
   */
  #uri: string;

  /**
   * The resolved render configuration
   */
  #renderConfig: RenderConfig = new Map();

  /**
   * Indicates the version of the last configuration file we've loaded. This
   * may be null if a configuration file has not been loaded yet.
   */
  #currentVersion: string | null = null;
  /**
   * The resolved init to run at service startup
   */
  #init: InitFn = _echarts => {};

  constructor(uri: string) {
    this.#uri = uri;
  }

  /**
   * Fetch and return the configuration module.
   *
   * @param deadline When a deadline is provided, fetching the module via HTTP
   *                 will be aborted if the deadline is exceeded. Specified in
   *                 milliseconds.
   */
  async fetchConfig(deadline: number) {
    if (!this.configIsViaHttp) {
      return require(/* webpackIgnore: true */ path.resolve(this.#uri)).default;
    }

    let config: any = null;

    // Handle fetch deadline via an AbortController
    const ac = new AbortController();
    const deadlineTimeout = setTimeout(() => ac.abort(), deadline);

    try {
      config = await loadViaHttp(this.#uri, ac);
    } finally {
      clearTimeout(deadlineTimeout);
    }

    return config;
  }

  /**
   * Resolve the provided configuration URI. If the configuration cannot be
   * resolved, an error will be thrown.
   */
  async resolveEnsured() {
    const isHttpUrl = this.configIsViaHttp;
    logger.info(`Resolving render config via ${isHttpUrl ? 'HTTP' : 'provided file'}`);

    const config = await this.fetchConfig(60 * 1000);
    const [validConfig, errors] = validateConfig(config);

    if (errors !== undefined) {
      logger.error(`Failed to load config with errors: ${errors}`);
      return;
    }

    logger.info(`Resolved config: ${validConfig.renderConfig.size} styles available.`, {
      version: validConfig.version,
    });

    this.#currentVersion = validConfig.version;
    this.#renderConfig = validConfig.renderConfig;
    if (validConfig.init) {
      this.#init = validConfig.init;
    }
    this.triggerInit();
  }

  /**
   * Poll to load + update the specified configuration module
   */
  resolveWithPolling(pollConfig: PollingConfig) {
    const poller = new ConfigPoller(this, pollConfig);

    logger.info('Using polling strategy to resolve configuration...');
    poller.startPolling({immediate: true});
  }

  /**
   * Sets the render config
   */
  setRenderConfig(config: RenderConfig) {
    this.#renderConfig = config;
  }

  /**
   * Set a specific render config style. Primarily used for testing.
   */
  setRenderStyle(style: string, config: RenderDescriptor) {
    this.#renderConfig.set(style, config);
  }

  /**
   * Set the current config version.
   */
  setVersion(version: string) {
    this.#currentVersion = version;
  }

  setInit(init: InitFn | undefined) {
    if (init) {
      this.#init = init;
    } else {
      this.#init = _echarts => {};
    }
  }

  triggerInit() {
    this.#init(echarts);
  }

  /**
   * Get a render style configuration given the style key
   */
  getConfig(style: string) {
    return this.#renderConfig.get(style);
  }

  /**
   * Indicates if the specified configuration URI is via HTTP
   */
  get configIsViaHttp() {
    let url: URL | null = null;

    try {
      url = new URL(this.#uri);
    } catch {
      // Not a valid URL
    }

    return url?.protocol?.startsWith('http') ?? false;
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
