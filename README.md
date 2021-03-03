<p align="center">
  <img src="https://raw.githubusercontent.com/getsentry/chartcuterie/master/assets/logo.svg" alt="Chartcuterie" width="200" />
</p>

<h3 align="center">
	Chartcuterie offers fresh slices and dices of absolutely delectable graphs.
</h3>

<p align="center">
	<img src="https://github.com/getsentry/chartcuterie/workflows/build/badge.svg" alt="build" />
	<a href="https://www.npmjs.com/package/chartcuterie"><img alt="npm" src="https://img.shields.io/npm/v/chartcuterie"></a>
</p>

---

Sentry's _Chartcuterie_ generates charts as images, specifically designed to
aid in unfurling Sentry links with charts into slack, displaying useful charts
in emails, and anywhere else outside of a browser environment where charts add
valuable context.

`echarts` + `node-canvas` is used internally to produce the charts.

## Documentation

Chartcuterie can be run in two different modes

 * **`chartcuterie render`** - Accepts JSON data on stdin and writes out the
   produced image to stdout.

 * **`chartcuterie server`** - Runs the service as an HTTP API.  
   It will accept a JSON body at `POST /render` and will respond with the image when successful.

### Configuration

A configuration module is required to start Chartcuterie in any rendering mode.
This module is used to specify how to transform data received to a valid
[`EChart.Option`](https://echarts.apache.org/en/option.html#title) object
structure.

A simple configuration module might look like this:

```tsx
const config = {
  /**
   * Each key in the configuration objects represents a rendering style
   * configurtion. When passing your render data to chartcuterie you'll use
   * this key to indicate what rendering config to use to produce your chart.
   */
  'myStyle:example': {
    key: 'myStyle:example',

    /**
     * The height and width of the produced image is specified as part of the
     * render configuration.
     */
    height: 200,
    width: 600,

    /**
     * This function is used to transform the `data` passed in your rendering
     * data JSON into a valid `EChart.Option`.
     */
    getOption: data => {
      return {series: data};
    },
  },

  // More rendering styles specified in this object.
}

module.exports = config;
```

#### Configuration resolution

The configuration module may be specified as either a filepath or alternatively
a HTTP URL. Specifying the file as a HTTP URL may be useful when your
configuration file is produced by a different service, such is the case for
Sentry, where the configuration is co-located with Sentry's frontend chart
rendering modules.

> **IMPORTANT**: When resolving the configuration over HTTP be **ABSOLUTELY
> SURE** that the configuration file can be trusted and will not contain any
> malicious JavaScript. The configuration file is evaluated with the same
> privileges the running instance of chartcuterie has!

### Rendering charts

To render a chart in any rendering mode, you will need to supply some
"rendering data". That is a JSON object that looks like this:

```js
{
  /**
   * The request ID can be useful for tracing your render request
   */
  "requestId": "<some unique request identifier>",

  /**
   * The rendering style as specified in your configuration
   */
  "style": "myStyle:example",

  /**
   * The data object is totally arbitrary and is up to your configuration's
   * `getOption` function to translate it into a valid echarts series.
   */
  "data": "<anything you want here>"
}
```

## Development

This project uses [`volta`](https://volta.sh/) to manage the node toolchain, be sure to have Volta installed and configured.

 * `yarn lint` - Check for Typescript and Eslint errors / warnings.
 * `yarn build` - Builds the application
 * `yarn watch` - Watches source files for changes and recompiles using `tsc` on changes.

To start the service you will need to specify a `config` file. See the
documentation above for examples of simple configuration you can use for
testing.

Generally running like this is sufficient

```
node lib/index.js --config=exampleConfig.js render < example-data.json > example.png
```

## License

Like Sentry, Chartcuterie is licensed under the BSL. See the `LICENSE` file and [this
forum post](https://forum.sentry.io/t/re-licensing-sentry-faq-discussion/8044)
for more information.
