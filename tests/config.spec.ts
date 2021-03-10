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
        const renderConfig = new Map();
        renderConfig.set('fileExample', {
          key: 'fileExample',
          height: 200,
          width: 100,
          getOption: (series: any) => ({series}),
        });

        return {default: {renderConfig, version: 'abc'}};
      },
      {virtual: true}
    );

    const config = new ConfigService('myConfig');
    await config.resolveEnsured();

    expect(config.getConfig('fileExample')?.height).toEqual(200);
  });

  it('can load config via http', async () => {
    const configModule = `
    var renderConfig = new Map();
    renderConfig.set('example', {
      key: 'example',
      height: 100,
      width: 100,
      getOption: series => ({series}),
    });

    module.exports = {renderConfig, version: 'abc'};`;

    fetchMock.mockResponse(configModule);

    const config = new ConfigService('https://example.com/myConfig.js');
    await config.resolveEnsured();

    expect(fetchMock.mock.calls[0][0]).toEqual('https://example.com/myConfig.js');
    expect(config.getConfig('example')?.height).toEqual(100);
  });
});
