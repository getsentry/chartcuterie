import {createCanvas} from 'canvas';
import * as echarts from 'echarts';

import {RenderDescriptor} from './types';
import {disabledOptions, registerCanvasFonts} from './utils';

registerCanvasFonts();

// ECharts renders some series (e.g., heatmaps) on a separate canvas layer. In a
// browser it creates those layers via `document.createElement`, but in Node it
// has no way to do so and `createCanvas` returns `false`, blowing up when it
// tries to size the layer. Add the API for `canvas` creation.
echarts.setPlatformAPI({
  // ECharts always resizes the canvas after creating it, so these dimensions
  // are just placeholders.
  createCanvas: () => createCanvas(1, 1) as any,
});

/**
 * Renders a single chart
 */
export function renderSync(style: RenderDescriptor, data: any) {
  const canvas = createCanvas(style.width, style.height);

  // Get options object before echarts.init to ensure options can be created
  const options = style.getOption(data);

  const chart = echarts.init(canvas, undefined, {
    renderer: 'canvas',
    width: style.width,
    height: style.height,
  });
  chart.setOption({...options, ...disabledOptions});

  return {
    buffer: canvas.toBuffer('image/png'),
    dispose: () => chart.dispose(),
  };
}
