import * as Sentry from '@sentry/node';
import {nodeProfilingIntegration} from '@sentry/profiling-node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  profilesSampleRate: 1,
  tracesSampleRate: 1,
});
