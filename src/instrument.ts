import * as Sentry from '@sentry/node';
import {nodeProfilingIntegration} from '@sentry/profiling-node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 1,
  profileLifecycle: 'trace',
  profileSessionSampleRate: 1,
  _experiments: {
    enableLogs: true,
  },
});
