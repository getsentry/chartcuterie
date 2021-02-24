import {createCanvas} from 'canvas';
import * as echarts from 'echarts';

import {StyleDescriptor} from './types';
import {disabledOptions, registerCanvasFonts} from './utils';

registerCanvasFonts();
const initCanvas = createCanvas(0, 0);

// @ts-ignore setCanvasCreator is not documented in typescript [0]
// [0]: https://github.com/apache/echarts/issues/9727
echarts.setCanvasCreator(() => initCanvas);

/**
 * Renders a single chart
 */
export function renderSync(
  style: StyleDescriptor,
  series: echarts.EChartOption.Series[]
) {
  const canvas = createCanvas(style.width, style.height);
  const htmlCanvas = (canvas as unknown) as HTMLCanvasElement;

  const chart = echarts.init(htmlCanvas);
  chart.setOption({...style.getOption(series), ...disabledOptions});

  return [canvas.createPNGStream(), () => chart.dispose()] as const;
}
