import store from '@/plugins/pinia'
import LocalStorage from '@/plugins/LocalStorage'
import { useCredentialStore } from '@/store/credential'
import { SaveData } from '@/plugins/LocalStorage'
import ChromeHelper from '../helpers/ChromeHelper'

interface BindingInstance { }
interface BindingModel {
  instance: BindingInstance
  dependencies?: Array<string>
}
const constant = {
  MSG_ERROR_CANT_RESOLVE: "Can't resolve abstraction"
}

export default class AppContext {
  private services = new Map<string, BindingModel>()
  private static __instance: AppContext

  public static getInstance(): AppContext {
    if (AppContext.__instance == null) {
      this.__instance = new AppContext()
      this.__instance.init()
    }

    return AppContext.__instance
  }

  public init(): void {
    const getLocalStorage = () => {
      const mockChromeLocalStorage = {
        async get(keys: Array<string>) {
          return { credentials: localStorage.getItem('credentials') }
        },
        async set(saveData: SaveData) {
          localStorage.setItem('credentials', JSON.stringify(saveData.credentials))
        },
        async remove() { }
      }
      const store = new LocalStorage(mockChromeLocalStorage)
      return store
    }
    this.bind('localStorage', getLocalStorage())

    const credentials = (async () => {
      const localStorage = this.make('localStorage')
      return localStorage.getItem('credentials')
    })()
    this.bind('credentials', credentials)

    const getMockLogger = () => {
      const { error, log, warn } = console
      return { error, log, warn }
    }
    this.bind('logger', getMockLogger())

    this.bind('chrome', window?.chrome ?? null)
    const getChromeHelper = () => {
      const chrome = this.resolve('chrome')

      if (chrome) {
        return new ChromeHelper();
      } else {
        const mockChromeHelper = {
          notify: (title: string, msg: string) => console.log(`${title} - ${msg}`)
        }
        return mockChromeHelper;
      }
    }
    this.bind('chromeHelper', getChromeHelper())
    this.bind('pinia', store)
    this.bind('useCredentialStore', useCredentialStore, ['pinia'])
  }

  /**
   * Make precise implementation
   * @param abstraction
   */
  public make(abstraction: string): any {
    let service = null
    try {
      service = this.resolve(abstraction)
    } catch (err) {
      // Ignore
    }

    if (!service) {
      throw new Error(constant.MSG_ERROR_CANT_RESOLVE)
    }

    return service
  }

  /**
   * Make precise implementation for given services
   * @param abstraction
   */
  public makeMany(abstractions: string[]): any {
    let services: Record<string, any> = {}

    try {
      abstractions.forEach((abstraction) => {
        let service = this.resolve(abstraction)
        if (!service) {
          throw new Error(constant.MSG_ERROR_CANT_RESOLVE)
        }

        services[abstraction] = service
      })
    } catch (err) {
      // Ignore errors
    }

    return services
  }

  private bind(abstraction: string, instance: any, dependencies: Array<string> = []): void {
    if (!this.ensureDependencies(dependencies)) {
      throw new Error(constant.MSG_ERROR_CANT_RESOLVE)
    }

    const bindings = {
      instance: instance,
      dependencies: dependencies
    }
    this.services.set(abstraction, bindings)
  }

  private ensureDependencies(dependencies: Array<string>) {
    if (dependencies.length > 0) {
      for (const dependency of dependencies) {
        if (this.resolve(dependency) == null) {
          return false
        }
      }
    }

    return true
  }

  private resolve(abstraction: string): any {
    const bindings = this.services.get(abstraction)
    const result = bindings?.instance
    return result
  }
}
