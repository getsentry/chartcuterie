import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

import ConfigService from 'app/config';

describe('config', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('can load config via files', async () => {
    jest.mock(
      'myConfig',
      () => {
        const config = new Map();
        config.set('fileExample', {
          key: 'fileExample',
          height: 200,
          width: 100,
          getOption: (series: any) => ({series}),
        });

        return {default: config};
      },
      {virtual: true}
    );

    const config = new ConfigService('myConfig');
    await config.resolve();

    expect(config.getConfig('fileExample')?.height).toEqual(200);
  });

  it('can load config via http', async () => {
    const configModule = `
    var config = new Map();
    config.set('example', {
      key: 'example',
      height: 100,
      width: 100,
      getOption: series => ({series}),
    });

    module.exports = config;`;

    fetchMock.mockResponse(configModule);

    const config = new ConfigService('https://example.com/myConfig.js');
    await config.resolve();

    expect(fetchMock.mock.calls[0][0]).toEqual('https://example.com/myConfig.js');
    expect(config.getConfig('example')?.height).toEqual(100);
  });
});
