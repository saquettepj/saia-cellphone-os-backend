import * as Sentry from '@sentry/node'
import { nodeProfilingIntegration } from '@sentry/profiling-node'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 1.0,
  tracesSampler: (samplingContext) => {
    const requestUrl =
      samplingContext?.normalizedRequest?.url || samplingContext?.name || ''

    if (requestUrl?.includes('/health-check')) {
      return 0.0
    }

    return 1.0
  },
})

Sentry.profiler.startProfiler()
Sentry.profiler.stopProfiler()

export { Sentry }
