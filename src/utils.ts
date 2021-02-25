import * as path from 'path';

import {registerFont} from 'canvas';

/**
 * Make our fonts available in node-canvas
 */
export function registerCanvasFonts() {
  const lastDir = process.cwd();
  process.chdir(path.resolve(__dirname, '../fonts'));

  registerFont('./rubik-regular.woff', {family: 'Rubik', weight: 'normal'});
  registerFont('./rubik-medium.woff', {family: 'Rubik', weight: 'medium'});

  process.chdir(lastDir);
}

/**
 * Globally disabled options for rendering charts
 */
export const disabledOptions: echarts.EChartOption = {
  animation: false,
  toolbox: undefined,
  tooltip: undefined,
};
