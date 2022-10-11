import {createCanvas} from '@napi-rs/canvas';
import * as echarts from 'echarts';

import {RenderDescriptor} from './types';
import {disabledOptions, registerCanvasFonts} from './utils';

registerCanvasFonts();

/**
 * Renders a single chart
 */
export function renderSync(style: RenderDescriptor, data: any) {
  const canvas = createCanvas(style.width, style.height);

  // Get options object before echarts.init to ensure options can be created
  const options = style.getOption(data);

  const chart = echarts.init(canvas as any, undefined, {renderer: 'canvas'});
  chart.setOption({...options, ...disabledOptions});

  return {
    buffer: canvas.encodeSync('png'),
    dispose: () => chart.dispose(),
  };
}
