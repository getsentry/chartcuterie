# Sentry Chart Renderer

This is a small service written in NodeJS to generate chart graphics using
[node-canvas](https://www.npmjs.com/package/canvas)
+ [ECharts](https://echarts.apache.org/en/index.html). This service takes a
configuration file defining styles, accepts JSON input for series data, and
produces a png image to stdout.

It can also opearte in a web-server mode to produce charts.
