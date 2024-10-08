import fetchMock from 'jest-fetch-mock';
import {promises as fsPromises} from 'node:fs';

fetchMock.enableMocks();

import {ConfigService} from 'app/config';

jest.mock('node:fs', () => ({
  ...jest.requireActual('node:fs'),
  promises: {readFile: jest.fn()},
}));

describe('config', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('can load config via files', async () => {
    const configModule = `
    var renderConfig = new Map();
    renderConfig.set('fileExample', {
      key: 'example',
      height: 200,
      width: 100,
      getOption: series => ({series}),
    });

    module.exports = {renderConfig, version: 'abc'};`;

    jest.mocked(fsPromises.readFile).mockResolvedValue(Buffer.from(configModule));

    const config = new ConfigService('/myConfig');
    await config.resolveEnsured();

    expect(fsPromises.readFile).toHaveBeenCalledWith('/myConfig', 'utf8');
    expect(config.getConfig('fileExample')?.height).toEqual(200);
  });

  it('does not require init', async () => {
    const configModule = `
    var renderConfig = new Map();
    renderConfig.set('example', {
      key: 'example',
      height: 200,
      width: 100,
      getOption: series => ({series}),
    });

    module.exports = {
      renderConfig,
      version: 'abc',
      init: _ => console.log('init called')
    };`;

    const consoleSpy = jest.spyOn(console, 'log');
    consoleSpy.mockImplementation(() => {});

    jest.mocked(fsPromises.readFile).mockResolvedValue(Buffer.from(configModule));

    const config = new ConfigService('/myConfig');
    await config.resolveEnsured();

    expect(config.getConfig('example')?.height).toEqual(200);
    expect(consoleSpy).toHaveBeenCalledWith('init called');
  });

  it('can load config via http', async () => {
    const configModule = `
    var renderConfig = new Map();
    renderConfig.set('example', {
      key: 'example',
      height: 200,
      width: 100,
      getOption: series => ({series}),
    });

    module.exports = {renderConfig, version: 'abc', init: _ => {}};`;

    fetchMock.mockResponse(configModule);

    const config = new ConfigService('https://example.com/myConfig.js');
    await config.resolveEnsured();

    expect(fetchMock.mock.calls[0][0]).toEqual('https://example.com/myConfig.js');
    expect(config.getConfig('example')?.height).toEqual(200);
  });
});
