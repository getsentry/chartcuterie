import * as path from 'path';

import {Resvg, ResvgRenderOptions} from '@resvg/resvg-js';
import * as echarts from 'echarts';

import {RenderDescriptor} from './types';
import {disabledOptions} from './utils';

function fontFile(name: string) {
  return path.join(__dirname, '/../fonts/', name);
}

/**
 * Renders a single chart
 */
export function renderSync(style: RenderDescriptor, data: any) {
  // Get options object before echarts.init to ensure options can be created
  const options = style.getOption(data);

  // @ts-expect-error expects a HTMLElement as the first argument
  const chart = echarts.init(null, null, {
    renderer: 'svg',
    ssr: true,
    width: style.width,
    height: style.height,
  });
  chart.setOption({...options, ...disabledOptions});

  const opts: ResvgRenderOptions = {
    fitTo: {mode: 'width', value: style.width},
    shapeRendering: 1, // crispEdges
    textRendering: 1, // optimizeLegibility
    imageRendering: 0, // optimizeQuality
    font: {
      fontFiles: [
        fontFile('/rubik-medium.woff'),
        fontFile('/rubik-regular.woff'),
        fontFile('/rubik-mono-regular.woff'),
      ],
      loadSystemFonts: true, // Loading system fonts might be slow?
    },
  };
  const resvg = new Resvg(chart.renderToSVGString(), opts);
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return {
    buffer: pngBuffer,
    dispose: () => chart.dispose(),
  };
}
