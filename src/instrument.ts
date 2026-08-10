import * as Sentry from '@sentry/node';
import {nodeProfilingIntegration} from '@sentry/profiling-node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 1,
  profileLifecycle: 'trace',
  profileSessionSampleRate: 1,
  // Matches the v10 `sendDefaultPii: false` baseline. v11 defaults are more
  // permissive, so each category is set explicitly.
  dataCollection: {
    userInfo: false,
    cookies: false,
    httpHeaders: {
      request: {deny: ['forwarded', '-ip', 'remote-', 'via', '-user']},
      response: {deny: ['forwarded', '-ip', 'remote-', 'via', '-user']},
    },
    httpBodies: [],
    urlQueryParams: {deny: ['forwarded', '-ip', 'remote-', 'via', '-user']},
    graphQL: {document: false, variables: false},
    genAI: {inputs: false, outputs: false},
    databaseQueryData: false,
  },
});
