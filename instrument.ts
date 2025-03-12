/* eslint-disable @typescript-eslint/no-var-requires */
import type * as SentryNodeTypes from '@sentry/node'

let Sentry: typeof SentryNodeTypes | null = null

if (process.env.NODE_ENV !== 'test') {
  const SentryNode = require('@sentry/node') as typeof SentryNodeTypes
  const { nodeProfilingIntegration } = require('@sentry/profiling-node')

  SentryNode.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [nodeProfilingIntegration()],
    tracesSampleRate: 1.0,
    tracesSampler: (samplingContext) => {
      const requestUrl =
        samplingContext?.normalizedRequest?.url || samplingContext?.name || ''

      if (requestUrl.includes('/health-check')) {
        return 0.0
      }

      return 1.0
    },
  })

  SentryNode.profiler.startProfiler()
  SentryNode.profiler.stopProfiler()

  Sentry = SentryNode
}

export { Sentry }
