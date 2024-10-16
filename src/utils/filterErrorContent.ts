import { env } from '@/env'

function filterErrorContent(content: string): string {
  if (!content) {
    return 'No content!'
  }

  if (content.includes('double-quoted')) {
    return '- SyntaxError'
  }

  if (
    content.includes('Body cannot be empty') ||
    content.includes('JSON input')
  ) {
    return `- ${content}`
  }

  if (env.NODE_ENV !== 'production') {
    console.log(`🟥 ${content} 🟥`)
  }

  return ''
}

export { filterErrorContent }
