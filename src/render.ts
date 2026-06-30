import {createCanvas} from 'canvas';
import * as echarts from 'echarts';
import type {EChartsOption} from 'echarts';

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
  chart.setOption({
    ...options,
    series: disableProgressive(options.series as EChartsOption['series']),
    ...disabledOptions,
  });

  return {
    buffer: canvas.toBuffer('image/png'),
    dispose: () => chart.dispose(),
  };
}

// `progressive` is a per-series option in ECharts; there is no top-level
// equivalent, so it must be set on each series. Progressive rendering splits a
// series across multiple frames, which means `canvas.toBuffer` can snapshot a
// partially-drawn chart. It never makes sense in a server-rendered context.
// https://echarts.apache.org/en/option.html#series-heatmap.progressive
function disableProgressive(series: EChartsOption['series']): EChartsOption['series'] {
  if (Array.isArray(series)) {
    return series.map(s => ({...s, progressive: 0}));
  }
  if (series) {
    return {...series, progressive: 0};
  }
  return series;
}
