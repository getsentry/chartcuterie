import * as fs from 'fs';
import * as util from 'util';

import {renderSync} from './render';
import {StyleConfig} from './types';
import {validateRenderData} from './validate';

const readAsync = util.promisify(fs.readFile);

/**
 * Take JSON input from stdin and generate and output a graph to stdout
 */
export async function renderStream(styles: StyleConfig) {
  const json = await readAsync(process.stdin.fd, {encoding: 'utf8'});

  let data: any;
  try {
    data = JSON.parse(json);
  } catch (err) {
    throw new Error(`Invalid JSON input: ${err}`);
  }

  const [renderData, errors] = validateRenderData(styles, data);

  if (errors !== undefined) {
    throw new Error(errors.message);
  }

  const style = styles.get(renderData.style);

  if (style === undefined) {
    throw new Error('Invalid style key provided');
  }

  const [stream, dispose] = renderSync(style, renderData.series);

  stream.pipe(process.stdout);

  try {
    await new Promise((resolve, reject) => stream.on('end', resolve).on('error', reject));
  } finally {
    dispose();
  }
}
