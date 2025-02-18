import * as Sentry from '@sentry/node'
import { nodeProfilingIntegration } from '@sentry/profiling-node'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  beforeSend(event) {
    if (event.request?.url?.includes('/health-check')) {
      return null
    }

    return event
  },
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 1.0,
})

Sentry.profiler.startProfiler()
Sentry.profiler.stopProfiler()

export { Sentry }
