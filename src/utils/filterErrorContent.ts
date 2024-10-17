import { env } from '@/env'

function filterErrorContent(content: string): string {
  if (!content) {
    return 'No content!'
  }

  if (
    content.includes('Body cannot be empty') ||
    content.includes('JSON input') ||
    content.includes(`Expected ',' or '}'`) ||
    content.includes('double-quoted')
  ) {
    return `- ${content}`
  }

  if (env.NODE_ENV !== 'production') {
    console.log(`🟥 ${content} 🟥`)
  }

  return ''
}

export { filterErrorContent }
