import type {EChartsOption} from 'echarts';
import fs from 'node:fs';

import ConfigService from 'app/config';
import {renderStream} from 'app/renderStream';
import {RenderData} from 'app/types';

jest.mock('node:fs');

describe('renderStream', () => {
  it('can render graphs given a valid config and render data', async () => {
    const config = new ConfigService('./example');
    config.setRenderStyle('dayChart', {
      key: 'dayChart',
      height: 250,
      width: 400,
      getOption: (series: any): EChartsOption => ({
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed'],
          axisLabel: {fontFamily: 'Verdana'},
        },
        yAxis: {
          type: 'value',
          axisLabel: {fontFamily: 'Verdana'},
        },
        series,
      }),
    });

    const renderData: RenderData = {
      requestId: 'some-id',
      style: 'dayChart',
      data: {
        type: 'line',
        data: [0, 10, 5],
      },
    };

    // Force readfile to read exaple render data
    const data = Buffer.from(JSON.stringify(renderData));
    const mockReadFile = (_fd: any, _opts: any, callback: any) => callback(null, data);
    jest.spyOn(fs, 'readFile').mockImplementation(mockReadFile as typeof fs.readFile);

    // Capture output from stdout
    const stdoutSpy = jest
      .spyOn(process.stdout, 'write' as any)
      .mockImplementation(() => true);

    await renderStream(config);
    jest.restoreAllMocks();

    const output = Buffer.concat(stdoutSpy.mock.calls.map(call => call[0]) as Buffer[]);

    expect(output).toMatchImageSnapshot();
  });
});
