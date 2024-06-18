import * as Sentry from '@sentry/node';
import {nodeProfilingIntegration} from '@sentry/profiling-node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 1,
});

const client = Sentry.getClient();

if(client) {
  const profilingIntegration = client.getIntegrationByName("ProfilingIntegration");

  if(profilingIntegration) {
    // @ts-expect-error this is purposefuly not exposed by the SDK for now
    profilingIntegration._profiler.start();
  }
}
