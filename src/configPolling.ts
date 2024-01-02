import * as Sentry from '@sentry/node';

import {ConfigService} from './config';
import {logger} from './logging';
import {PollingConfig} from './types';
import {validateConfig} from './validate';

type StartOptions = {
  /**
   * Immediately trigger a polling tick when starting
   */
  immediate: boolean;
};

/**
 * The ConfigPoller is used for two things:
 *
 *  1. During boot we poll on the bootInterval to load the configuration module.
 *     Typically this will be a fairly quick poll to boot the service ASAP.
 *
 *  2. After it's booted, it will switch to the idleInterval. This is typically
 *     much slower and is intended for the service to keep in sync with updates
 *     to the configuration.
 *
 * It will automatically switch from the bootInterval to idleInterval after the
 * first configuration module is loaded.
 */
export default class ConfigPoller {
  /**
   * The ConfigService the ConfigPoller is associated to
   */
  #config: ConfigService;
  /**
   * Configuration for polling
   */
  #settings: PollingConfig;
  /**
   * Tracks reference handle of the setInterval
   */
  #interval: NodeJS.Timeout | null = null;

  constructor(config: ConfigService, settings: PollingConfig) {
    this.#config = config;
    this.#settings = settings;
  }

  /**
   * The polling interval (in ms) is dependant on if we've already successfully
   * loaded a configuration module or not.
   */
  get pollInterval() {
    return this.#config.isLoaded
      ? this.#settings.idleInterval
      : this.#settings.bootInterval;
  }

  /**
   * Fired when the polling interval ticks
   */
  #pollTick = async () => {
    logger.debug('Polling tick...');

    // Load deadline should match the polling interval
    const loadDeadline = this.pollInterval;

    let config: any = null;

    try {
      config = await this.#config.fetchConfig(loadDeadline);
    } catch (error) {
      const didAbort = error instanceof Error && error.name === 'AbortError';

      if (didAbort) {
        logger.debug('Config resolution aborted for next polling tick');
      } else {
        logger.warn(`Failed to resolve config while polling with error: ${error}`);
      }
      Sentry.captureException(error);
      return;
    }

    const [validConfig, errors] = validateConfig(config);

    if (errors !== undefined) {
      logger.warn(
        this.#config.isLoaded
          ? `Resolved NEW but INVALID config (${errors}). Not updating...`
          : `Resolved INVALID config during boot (${errors}). Trying again in ${
              this.pollInterval / 1000
            }s`
      );

      // TODO(epurkhiser): It's likely we need to yell a little louder here
      // if we've loaded an invalid configuration.

      return;
    }

    if (validConfig.version === this.#config.version) {
      logger.debug('Resolved the SAME configuration via polling. Nothing to do.');
      return;
    }

    logger.info(
      `Resolved new config via polling: ${validConfig.renderConfig.size} styles available.`,
      {version: validConfig.version}
    );

    const wasBootPolling = !this.#config.isLoaded;

    // Successful configuration update!
    this.#config.setVersion(validConfig.version);
    this.#config.setRenderConfig(validConfig.renderConfig);
    this.#config.setInit(validConfig.init);
    this.#config.triggerInit();

    // Switch to idle polling,
    if (wasBootPolling) {
      logger.info('Config polling switching to idle mode');

      this.stopPolling();
      this.startPolling({immediate: false});
    }
  };

  /**
   * Poll to load + update the specified configuration module
   */
  startPolling({immediate}: StartOptions) {
    if (immediate) {
      this.#pollTick();
    }

    logger.info(`Polling every ${this.pollInterval / 1000}s for config...`);
    this.#interval = setInterval(this.#pollTick, this.pollInterval);
  }

  /**
   * Stops polling for configuration module updates
   */
  stopPolling() {
    if (this.#interval === null) {
      return;
    }

    clearTimeout(this.#interval);
  }
}
