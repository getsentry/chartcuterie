import * as path from 'path';

import {registerFont} from 'canvas';

function fontFile(name: string) {
  return path.join(__dirname, '/../fonts/', name);
}

/**
 * Make our fonts available in node-canvas
 */
export function registerCanvasFonts() {
  registerFont(fontFile('/rubik-regular.woff'), {family: 'Rubik', weight: 'normal'});
  registerFont(fontFile('/rubik-medium.woff'), {family: 'Rubik', weight: 'medium'});
}

/**
 * Globally disabled options for rendering charts
 */
export const disabledOptions: echarts.EChartOption = {
  animation: false,
  toolbox: undefined,
  tooltip: undefined,
};
