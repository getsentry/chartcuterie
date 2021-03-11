import {ValidationError} from 'joi';

import ConfigService from 'app/config';
import {RenderDescriptor} from 'app/types';
import {validateConfig, validateRenderData} from 'app/validate';

describe('validate', () => {
  const validConfig = {
    version: 'abc',
    renderConfig: {
      example: {
        key: 'example',
        height: 100,
        width: 100,
        getOption: (series: any) => ({series}),
      },
    },
  };

  it('validates renderer configuration objects', () => {
    const [config1, error1] = validateConfig(validConfig);
    expect(config1).toEqual(validConfig);
    expect(error1).toBeUndefined();

    const invalid = {
      version: 'abc',
      renderConfig: {
        example: {
          height: '100',
          width: 100,
          getOption: (series: any) => ({series}),
        },
      },
    };

    const [, error2] = validateConfig(invalid);
    expect(error2).toBeInstanceOf(ValidationError);
  });

  it('validates render data', () => {
    const config = new ConfigService('./example.js');
    config.setRenderStyle(
      'example',
      validConfig.renderConfig.example as RenderDescriptor
    );

    const validData = {
      requestId: 'anything',
      style: 'example',
      data: ['my-data'],
    };

    const [data1, error1] = validateRenderData(config, validData);
    expect(data1).toEqual(validData);
    expect(error1).toBeUndefined();

    const invalidData = {
      requestId: 'anything',
      style: 'wrongKey',
      data: ['my-data'],
    };

    const [, error2] = validateRenderData(config, invalidData);
    expect(error2).toBeInstanceOf(ValidationError);
  });
});
