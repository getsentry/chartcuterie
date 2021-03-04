import {configureToMatchImageSnapshot} from 'jest-image-snapshot';

import {registerConsoleLogger} from 'app/logging';

const toMatchImageSnapshot = configureToMatchImageSnapshot({
  /**
   * This is a relatively high threshold, but becuase we run tests on MacOS and
   * Ubuntu, the font rendering in Cario is slightly different, so this tries
   * to account for that.
   */
  customDiffConfig: {threshold: 0.8},
});

expect.extend({toMatchImageSnapshot});

// Disable registering fonts in node-canvas
jest.mock('app/utils', () => ({
  registerCanvasFonts: () => {},
}));

registerConsoleLogger({silent: true});
