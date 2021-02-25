import {EChartOption} from 'echarts';

export type RenderOption = Omit<EChartOption, 'animation' | 'tooltip' | 'toolbox'>;

/**
 * Describes configuration for a renderable chart style
 */
export type StyleDescriptor<D extends string = string> = {
  key: D;
  /**
   * Height of the produced image in pixels
   */
  height: number;
  /**
   * Width of the produced image in pixels
   */
  width: number;
  /**
   * Produce the echart option config for rendering the charts series
   */
  getOption: (series: EChartOption.Series[]) => RenderOption;
};

/**
 * Maps style keys to configratuins
 */
export type StyleConfig<D extends string = string> = Map<D, StyleDescriptor<D>>;

/**
 * The data given to the service to render a chart
 */
export type RenderData = {
  /**
   * Globally unique render ID.
   */
  requestId: string;
  /**
   * The style config key
   */
  style: string;
  /**
   * Echarts series data
   */
  series: EChartOption.Series[];
};
