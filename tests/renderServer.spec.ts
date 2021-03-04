import {EChartOption} from 'echarts';
import supertest from 'supertest';

import ConfigService from 'app/config';
import {renderServer} from 'app/renderServer';
import {RenderData} from 'app/types';

describe('renderServer', () => {
  describe('POST /render', () => {
    const config = new ConfigService('./example');
    config.setConfig('dayChart', {
      key: 'dayChart',
      height: 250,
      width: 400,
      getOption: (series: any) => ({
        xAxis: {
          type: 'category',
          data: ['Fri', 'Sat', 'Sun'],
          axisLabel: {fontFamily: 'Verdana'},
        },
        yAxis: {
          type: 'value',
          axisLabel: {fontFamily: 'Verdana'},
        },
        series,
      }),
    });

    it('responds with a chart', async () => {
      const renderData: RenderData = {
        requestId: 'some-id',
        style: 'dayChart',
        data: {
          type: 'line',
          data: [0, 5, 30],
        },
      };

      const app = renderServer(config);
      const resp = await supertest(app).post('/render').send(renderData);

      expect(resp.status).toBe(200);
      expect(resp.body).toMatchImageSnapshot();
    });

    it('Validates chart requests', async () => {
      const renderData: RenderData = {
        requestId: 'some-id',
        style: 'invalid-style',
        data: {
          type: 'line',
          data: [0, 5, 30],
        },
      };

      const app = renderServer(config);
      const resp = await supertest(app).post('/render').send(renderData);

      expect(resp.status).toBe(400);
      expect(resp.text).toBe('"style" must be [dayChart]');
    });
  });
});
