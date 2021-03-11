import {NO_VERSION} from 'app/config';
import ConfigPoller from 'app/configPolling';
import {PollingConfig} from 'app/types';

describe('configPoller', () => {
  jest.useFakeTimers();

  const testConfig: PollingConfig = {
    bootInterval: 5,
    idleInterval: 20,
  };

  it('continuously resolves config via polling', async () => {
    const mockConfigService = {
      fetchConfig: jest.fn(),
      setVersion: jest.fn(),
      setRenderConfig: jest.fn(),
      isLoaded: false,
      version: NO_VERSION as any,
    };

    mockConfigService.setVersion.mockImplementation((version: string) => {
      mockConfigService.isLoaded = true;
      mockConfigService.version = version;
    });

    const renderConfig = new Map();
    renderConfig.set('fileExample', {
      key: 'fileExample',
      height: 200,
      width: 100,
      getOption: (series: any) => ({series}),
    });

    const poller = new ConfigPoller(mockConfigService as any, testConfig);
    mockConfigService.fetchConfig.mockReturnValue(null);

    // Boots and immediately fetches config. Does not yet resolve a config yet
    // as fetchConfig returns an invalid config.
    poller.startPolling({immediate: true});
    expect(mockConfigService.fetchConfig).toHaveBeenCalledTimes(1);
    expect(mockConfigService.fetchConfig).toHaveBeenCalledWith(5);

    // Next tick loads the config
    mockConfigService.fetchConfig.mockReturnValue({renderConfig, version: 'abc'});
    jest.advanceTimersByTime(5);
    await Promise.resolve();

    expect(mockConfigService.fetchConfig).toHaveBeenCalledTimes(2);
    expect(mockConfigService.fetchConfig).toHaveBeenCalledWith(5);

    expect(mockConfigService.setVersion).toHaveBeenCalledWith('abc');
    expect(mockConfigService.setRenderConfig).toHaveBeenCalledWith(renderConfig);

    // Configuration has been loaded
    mockConfigService.isLoaded = true;
    mockConfigService.setVersion.mockClear();

    // Is no longer polling for boot
    jest.advanceTimersByTime(5);
    expect(mockConfigService.fetchConfig).toHaveBeenCalledTimes(2);

    // Next polling tick happens at 20 seconds
    jest.advanceTimersByTime(15);
    await Promise.resolve();
    expect(mockConfigService.fetchConfig).toHaveBeenCalledTimes(3);

    // No new version is loaded, we resolve the same configuration version
    expect(mockConfigService.setVersion).not.toHaveBeenCalled();

    // Setup new config version for next polling tick
    mockConfigService.fetchConfig.mockReturnValue({renderConfig, version: 'def'});
    jest.advanceTimersByTime(20);
    await Promise.resolve();

    expect(mockConfigService.fetchConfig).toHaveBeenCalledTimes(4);
    expect(mockConfigService.setVersion).toHaveBeenCalledWith('def');

    // Resolve invalid config, ensure we don't overwrite the active config
    mockConfigService.setVersion.mockClear();
    mockConfigService.fetchConfig.mockReturnValue({renderConfig, version: null});
    jest.advanceTimersByTime(20);
    await Promise.resolve();

    expect(mockConfigService.fetchConfig).toHaveBeenCalledTimes(5);
    expect(mockConfigService.setVersion).not.toHaveBeenCalled();
  });
});
