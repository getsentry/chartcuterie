# Upgrade Sentry SDKs from 9.16.1 to 9.30.0

This PR upgrades the following Sentry packages from version `9.16.1` to `9.30.0`:

- `@sentry/node`: `^9.16.1` → `^9.30.0`
- `@sentry/profiling-node`: `^9.16.1` → `^9.30.0`

## Key Changes for Node SDK

The upgrade includes several important improvements and new features for the Node SDK:

### 🚀 New Features

- **Node 24 Support** (9.18.0): Added support for Node.js 24 with profiling binaries
- **Vercel AI Integration** (9.30.0, 9.29.0, 9.28.0, 9.27.0): Multiple enhancements:
  - Automatic detection and activation when `ai` module is present
  - Updated span attributes to match OpenTelemetry conventions
  - Expanded input/output configuration options
  - Force activation option for better control
- **Koa Integration Enhancement** (9.29.0): New `ignoreLayersType` option for better middleware handling
- **HTTP Instrumentation** (9.25.0): Added `includeServerName` option for better server identification
- **Request Body Size Control** (9.20.0): New `maxIncomingRequestBodySize` option
- **tRPC Improvements** (9.20.0): Fork isolation scope in tRPC middleware for better context isolation

### 🔧 Improvements

- **Performance Optimizations** (9.23.0): HTTP & fetch span instrumentation is now disabled when tracing is disabled
- **Trace Propagation** (9.18.0): Improved trace propagation in Node.js 22+ environments
- **Breadcrumb Management** (9.21.0): Reduced noise by avoiding breadcrumbs for suppressed requests
- **Fastify Integration** (9.17.0, 9.21.0): Migrated to `@fastify/otel` with vendored implementation

### 🐛 Bug Fixes

- **Header Handling** (9.26.0): Fixed crashes when adding sentry-trace and baggage headers via SentryHttpInstrumentation
- **Spotlight Integration** (9.23.0): Fixed warnings on empty NODE_ENV and improved Spotlight call suppression

## Profiling Node SDK

The `@sentry/profiling-node` package has been updated alongside the main Node SDK and now supports:
- Node.js 24 profiling binaries
- Improved compatibility with the latest Node.js versions

## Breaking Changes

No breaking changes were identified between versions 9.16.1 and 9.30.0.

## Changelog Reference

For the complete list of changes, see the [Sentry JavaScript SDK Changelog](https://github.com/getsentry/sentry-javascript/blob/develop/CHANGELOG.md#changelog).