'use strict';
// Exercises the full rendering path: canvas init, font loading, echarts render, PNG output.
// Runs as a build-time check in the Docker runtime stage — any missing .so or font files
// will cause this to throw and fail the build.
//
// The expected hash pins the exact pixel output. If it changes, update it by running:
//   docker build -t chartcuterie:local . && \
//   docker run --rm chartcuterie:local node -e "
//     const crypto = require('crypto');
//     const {renderSync} = require('./lib/render');
//     const r = renderSync({key:'smoke',height:100,width:100,getOption:()=>({
//       xAxis:{type:'category'},yAxis:{type:'value'},series:[{type:'line',data:[1,2,3]}]
//     })},[]);
//     console.log(crypto.createHash('sha256').update(r.buffer).digest('hex'));
//     r.dispose();
//   "
const crypto = require('crypto');
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

const EXPECTED_SHA256 = '2616947b26199985b53250044725868a530ee2e2328ed2380825a2cbd71c37f9';
const actual = crypto.createHash('sha256').update(buffer).digest('hex');
if (actual !== EXPECTED_SHA256) {
  throw new Error(`smoke test failed: output hash ${actual} !== expected ${EXPECTED_SHA256}`);
}
