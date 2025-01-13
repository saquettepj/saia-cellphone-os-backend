import puppeteer, { Browser } from 'puppeteer'

import { ClientNameNotFoundError } from '@/errors/clientNameNotFoundError'

interface IGetClientNameByCPFUseCaseRequest {
  CPF: string
}

interface IGetClientNameByCPFUseCaseResponse {
  name: string
}

class PuppeteerManager {
  private static browser: Browser | null = null
  private static idleTimeout: NodeJS.Timeout | null = null
  private static readonly idleTime = 10000

  static async getBrowserInstance(): Promise<Browser> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      })
    }
    this.resetIdleTimeout()
    return this.browser
  }

  private static resetIdleTimeout(): void {
    if (this.idleTimeout) {
      clearTimeout(this.idleTimeout)
    }
    this.idleTimeout = setTimeout(async () => {
      if (this.browser) {
        await this.browser.close()
        this.browser = null
      }
    }, this.idleTime)
  }

  static async forceCloseBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close()
      this.browser = null
      this.clearIdleTimeout()
    }
  }

  private static clearIdleTimeout(): void {
    if (this.idleTimeout) {
      clearTimeout(this.idleTimeout)
      this.idleTimeout = null
    }
  }
}

class GetClientNameByCPFUseCase {
  async execute({
    CPF,
  }: IGetClientNameByCPFUseCaseRequest): Promise<IGetClientNameByCPFUseCaseResponse> {
    const searchedCPFObject: IGetClientNameByCPFUseCaseResponse = {
      name: '',
    }

    const browser = await PuppeteerManager.getBrowserInstance()
    const page = await browser.newPage()

    await page.setUserAgent(
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.5481.77 Safari/537.36',
    )

    try {
      await page.goto('https://www.situacao-cadastral.com/')
      await page.type('input[name="doc"]', CPF, { delay: 10 })
      await page.keyboard.press('Enter')

      const timeout = 2000
      await page.waitForSelector('#resultado .dados.nome', { timeout })

      const name = await page.$eval('#resultado .dados.nome', (element) => {
        return element.textContent?.trim() || ''
      })

      searchedCPFObject.name = name || ''
      return searchedCPFObject
    } catch (error) {
      throw new ClientNameNotFoundError()
    } finally {
      await page.close()
    }
  }
}

export {
  PuppeteerManager,
  GetClientNameByCPFUseCase,
  IGetClientNameByCPFUseCaseRequest,
  IGetClientNameByCPFUseCaseResponse,
}
