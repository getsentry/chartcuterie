import supertest from 'supertest';

import ConfigService from 'app/config';
import {renderServer} from 'app/renderServer';
import {RenderData} from 'app/types';

describe('renderServer', () => {
  describe('POST /render', () => {
    const config = new ConfigService('./example');
    config.setVersion('1.0-test');
    config.setRenderStyle('dayChart', {
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
      expect(resp.headers['x-config-version']).toBe('1.0-test');
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

  describe('GET /api/chartcuterie/healthcheck/live', () => {
    it('Responds 200 OK when configured', async () => {
      const config = new ConfigService('./example');
      config.setVersion('1.0-test');

      const app = renderServer(config);
      const resp = await supertest(app).get('/api/chartcuterie/healthcheck/live').send();

      expect(resp.status).toBe(200);
      expect(resp.text).toBe('OK');
    });

    it("503's before the config is loaded", async () => {
      const config = new ConfigService('/api/chartcuterie/healthcheck/ready');

      const app = renderServer(config);
      const resp = await supertest(app).get('/api/chartcuterie/healthcheck/ready').send();

      expect(resp.status).toBe(503);
      expect(resp.text).toBe('NOT CONFIGURED');
    });
  });
});
