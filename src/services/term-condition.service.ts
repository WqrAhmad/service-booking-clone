import { AxiosError } from 'axios'
import { authService } from './_singletons'
import type HttpService from './http.service'
import type {
  ITermCondition,
} from '@/model/term-condition.model'

export default class TermConditionService {
  constructor(private readonly httpService: HttpService) {
  }
  protected readonly routes = {
    CREATE: '/terms-conditions',
    SHOW: '/terms-conditions',
  }
 
  public async addTermCondition(payload: ITermCondition): Promise<ITermCondition> {
    return this.httpService.post<ITermCondition, ITermCondition>(this.routes.CREATE, payload)
  }
  public async showTermCondition(): Promise<ITermCondition> {
    return this.httpService.get<ITermCondition>(this.routes.SHOW)
  }
 
  public async onRejected(error: AxiosError | unknown): Promise<void> {
    if (
      error instanceof AxiosError
      && error?.response?.status
      && [401, 403].includes(error.response.status)
    ) {
      authService.logout()

      return window.location.replace('/#/login')
    }

    return Promise.reject(error)
  }
}
