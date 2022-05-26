import type {EChartsOption} from 'echarts';

export type RenderOption = Omit<EChartsOption, 'animation' | 'tooltip' | 'toolbox'>;

/**
 * Describes configuration for a renderable chart style
 */
export type RenderDescriptor<D extends string = string> = {
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
   * Produce the echart option config for rendering the charts series. It is up
   * to the implementation to declare what data it should receive, as long as
   * it produces a valid ECharts Option config.
   */
  getOption: (data: any) => RenderOption;
};

/**
 * Maps style keys to style descriptor configuration
 */
export type RenderConfig<D extends string = string> = Map<
  D,
  Readonly<RenderDescriptor<D>>
>;

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
   * Arbitrary series data. The RenderDescriptor.getOption should transform this
   * into a valid echarts series.
   */
  data: any;
  /**
   * Override style's default width
   */
  width?: number;
  /**
   * Override style's default height
   */
  height?: number;
};

/**
 * Performs any additional initialization steps on Chartcuterie's global
 * echarts object on service start up. For example, registerMaps can
 * be called here to register any available maps to ECharts.
 */
export type InitFn = (echarts: any) => void;

/**
 * The configuration object type expected to be provided to the service
 */
export type ChartcuterieConfig = {
  renderConfig: RenderConfig;
  /**
   * A string version identifier for the configuration. This may be useful for
   * validating that a chart is being rendered using a specific known
   * configuration.
   */
  version: string;
  /**
   * The optional initialization function to run when the service starts
   * or restarts due to configuration updates.
   */
  init?: InitFn;
};

/**
 * Configuration to specify how often to poll for configuration changes
 */
export type PollingConfig = {
  /**
   * The number of milliseconds between each polling attempt when the
   * application boots and has yet to load a configuration.
   */
  bootInterval: number;
  /**
   * The number of milliseconds between each polling attempt after the
   * application has already loaded a valid configuration file
   */
  idleInterval: number;
};
