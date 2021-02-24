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
  const json = await readAsync(0, {encoding: 'utf8'});

  let data: any;
  try {
    data = JSON.parse(json);
  } catch (err) {
    throw new Error(`Invalid JSON input: ${err}`);
  }

  if (!validateRenderData(data)) {
    throw new Error('Invalid series data provided on stdin');
  }

  const style = styles.get(data.style);

  if (style === undefined) {
    throw new Error('Invalid style key provided');
  }

  const [stream, dispose] = renderSync(style, data.series);

  stream.pipe(process.stdout);

  await new Promise((resolve, reject) => {
    stream.on('end', resolve);
    stream.on('error', reject);
  });

  dispose();
}
