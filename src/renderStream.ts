import * as fs from 'fs';
import * as util from 'util';

import ConfigService from './config';
import {renderSync} from './render';
import {validateRenderData} from './validate';

const readAsync = util.promisify(fs.readFile);

/**
 * Take JSON input from stdin and generate and output a graph to stdout
 */
export async function renderStream(config: ConfigService) {
  const json = await readAsync(process.stdin.fd, {encoding: 'utf8'});

  let data: any;
  try {
    data = JSON.parse(json);
  } catch (err) {
    throw new Error(`Invalid JSON input: ${err}`);
  }

  const [renderData, errors] = validateRenderData(config, data);

  if (errors !== undefined) {
    throw new Error(errors.message);
  }

  const style = config.getConfig(renderData.style);

  if (style === undefined) {
    throw new Error('Invalid config style key provided');
  }

  const render = renderSync(style, renderData.data);

  process.stdout.write(render.buffer);
  render.dispose();
}
