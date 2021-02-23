import * as fs from 'fs';
import * as util from 'util';

import {createCanvas} from 'canvas';
import * as echarts from 'echarts';
import {RenderData, StyleConfig, StyleDescriptor} from './types';
import yargsInit from 'yargs';
import {registerCanvasFonts, disabledOptions} from './utils';

registerCanvasFonts();
const initCanvas = createCanvas(0, 0);

// @ts-ignore setCanvasCreator is not documented in typescript [0]
// [0]: https://github.com/apache/echarts/issues/9727
echarts.setCanvasCreator(() => initCanvas);

/**
 * Renders a single chart
 */
function renderSync(style: StyleDescriptor, series: echarts.EChartOption.Series[]) {
  const canvas = createCanvas(style.width, style.height);
  const htmlCanvas = (canvas as unknown) as HTMLCanvasElement;

  const chart = echarts.init(htmlCanvas);
  chart.setOption({...style.getOption(series), ...disabledOptions});

  return [canvas.createPNGStream(), () => chart.dispose()] as const;
}

const readAsync = util.promisify(fs.readFile);

/**
 * Take JSON input from stdin and generate and output a graph to stdout
 */
async function handlerRender(styles: StyleConfig) {
  const json = await readAsync(0, {encoding: 'utf8'});

  let data: RenderData;
  try {
    data = JSON.parse(json);
  } catch (err) {
    throw new Error(`Invalid JSON input: ${err}`);
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

/**
 * Load external style configurations
 */
function styleConfigLoader(path: string) {
  return require(/* webpackIgnore: true */ path).default as StyleConfig;
}

yargsInit(process.argv.slice(2))
  .option('styles', {
    alias: 's',
    desc: 'Chart style configuration module',
    type: 'string',
  })
  .coerce('styles', styleConfigLoader)
  .demandOption('styles')
  .command(
    'serve [port]',
    'start the graph rendering web api',
    () => {},
    argv => {
      console.info('test1', argv);
    }
  )
  .command(
    'render',
    'renders a chart from a valid JSON input',
    yargs => {
      yargs.option('input', {
        alias: 'i',
        desc: 'The input JSON file (default to stdin)',
        type: 'string',
      });
      yargs.option('output', {
        alias: 'o',
        desc: 'The output image file (defaults to stdout)',
        type: 'string',
      });
    },
    argv => handlerRender(argv.styles)
  )
  .demandCommand(1, '')
  .parse();
