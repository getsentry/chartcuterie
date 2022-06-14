import {createCanvas, PngConfig} from 'canvas';
import * as echarts from 'echarts';

import {RenderDescriptor} from './types';
import {disabledOptions, registerCanvasFonts} from './utils';

registerCanvasFonts();
const initCanvas = createCanvas(0, 0);

// @ts-ignore setCanvasCreator is not documented in typescript [0]
// [0]: https://github.com/apache/echarts/issues/9727
echarts.setCanvasCreator(() => initCanvas);

const pngConfig: PngConfig = {
  // Configure png rendering here
};

/**
 * Renders a single chart
 */
export function renderSync(style: RenderDescriptor, data: any) {
  const canvas = createCanvas(style.width, style.height);
  const htmlCanvas = canvas as unknown as HTMLCanvasElement;

  // Get options object before echarts.init to ensure options can be created
  const options = style.getOption(data);

  const chart = echarts.init(htmlCanvas);
  chart.setOption({...options, ...disabledOptions});

  return {
    stream: canvas.createPNGStream(pngConfig),
    dispose: () => chart.dispose(),
  };
}
