import {createCanvas, PngConfig} from 'canvas';
import * as echarts from 'echarts';

import {RenderDescriptor} from './types';
import {disabledOptions, registerCanvasFonts} from './utils';

registerCanvasFonts();

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

  const chart = echarts.init(htmlCanvas, undefined, {
    renderer: 'canvas',
    width: style.width,
    height: style.height,
  });
  chart.setOption({...options, ...disabledOptions});

  return {
    stream: canvas.createPNGStream(pngConfig),
    dispose: () => chart.dispose(),
  };
}
