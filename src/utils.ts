import {registerFont} from 'canvas';

import rubikMedium from './fonts/rubik-medium.woff';
import rubikRegular from './fonts/rubik-regular.woff';

/**
 * Make our fonts available in node-canvas
 */
export function registerCanvasFonts() {
  const lastDir = process.cwd();
  process.chdir(__dirname);
  registerFont(rubikRegular, {family: 'Rubik', weight: 'normal'});
  registerFont(rubikMedium, {family: 'Rubik', weight: 'medium'});
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
