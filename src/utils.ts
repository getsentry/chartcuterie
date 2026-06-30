import {registerFont} from 'canvas';
import type {EChartsOption} from 'echarts';
import path from 'node:path';

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
export const disabledOptions: EChartsOption = {
  animation: false,
  toolbox: undefined,
  tooltip: undefined,
};
