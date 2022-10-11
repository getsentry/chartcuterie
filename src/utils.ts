import * as path from 'path';

import {GlobalFonts} from '@napi-rs/canvas';
import type {EChartsOption} from 'echarts';

function fontFile(name: string) {
  return path.join(__dirname, '/../fonts/', name);
}

/**
 * Make our fonts available in node-canvas
 */
export function registerCanvasFonts() {
  GlobalFonts.registerFromPath(fontFile('/rubik-regular.woff'), 'Rubik');
  GlobalFonts.registerFromPath(fontFile('/rubik-medium.woff'), 'Rubik');
  GlobalFonts.registerFromPath(fontFile('/roboto-mono-regular.woff'), 'Rubik');
}

/**
 * Globally disabled options for rendering charts
 */
export const disabledOptions: EChartsOption = {
  animation: false,
  toolbox: undefined,
  tooltip: undefined,
};
