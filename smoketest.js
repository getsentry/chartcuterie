'use strict';
// Exercises the full rendering path: canvas init, font loading, echarts render, PNG output.
// Runs as a build-time check in the Docker runtime stage — any missing .so or font files
// will cause this to throw and fail the build.
const {renderSync} = require('./lib/render');

const result = renderSync({
  key: 'smoke',
  height: 100,
  width: 100,
  getOption: () => ({
    xAxis: {type: 'category'},
    yAxis: {type: 'value'},
    series: [{type: 'line', data: [1, 2, 3]}],
  }),
}, []);

const {buffer} = result;
result.dispose();

const PNG_MAGIC = [0x89, 0x50, 0x4e, 0x47]; // \x89PNG
if (!PNG_MAGIC.every((b, i) => buffer[i] === b)) {
  throw new Error('smoke test failed: output is not a valid PNG');
}
