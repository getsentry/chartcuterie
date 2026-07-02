import {createCanvas} from 'canvas';
import type {SeriesOption} from 'echarts';
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
  // WARNING: SUPER HACKS 😭
  // Code for context: https://github.com/apache/echarts/blob/master/src/core/echarts.ts#L662-L703
  // Commit where this feature was added: https://github.com/apache/echarts-website/commit/8e897fa1e58b30db1dae85a1e9060bdbc0f61b0c#diff-8f31957f9bb06adae78b3a13c71455fa2dac55acba01411459aeffa427da8bb5
  // PLZ NOTE: this is not documented in ECharts docs so please check the code links above for more details!
  // Echarts defaults to waiting 15ms per layer to paint but obviously
  // charts with many data points (e.g. heatmaps) will take longer than that.
  // Setting this to 0 makes ECharts ignore that 15ms budget and paint the
  // chart fully; this means the code solely relies on the canvas paint to be finished
  // before returning the rendered chart. This fixes the issue of the chart rendering partially.
  getTime: () => 0,
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

  // `series` may be a single series or an array of them.
  let series = options.series as SeriesOption | SeriesOption[] | undefined;
  if (Array.isArray(series)) {
    series = series.map(disableProgressive);
  } else if (series) {
    series = disableProgressive(series);
  }

  chart.setOption({...options, series, ...disabledOptions});

  return {
    buffer: canvas.toBuffer('image/png'),
    dispose: () => chart.dispose(),
  };
}

// `progressive` is a per-series option in ECharts; there is no top-level
// equivalent, so it must be set on each series. Progressive rendering splits a
// series across multiple frames, which means `canvas.toBuffer` can snapshot a
// partially-drawn chart. It never makes sense in a server-rendered context.
// `progressiveThreshold` is the maximum number of data points before progressive rendering
// is enabled. We don't want to enable progressive rendering AT ALL so we'll need to set
// this to Infinity to disable it entirely.
// https://echarts.apache.org/en/option.html#series-heatmap.progressive
function disableProgressive(series: SeriesOption): SeriesOption {
  return {...series, progressive: 0, animation: false};
}
