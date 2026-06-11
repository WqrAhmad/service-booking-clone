import { AxiosError } from 'axios'
import type HttpService from './http.service'
import { authService } from './_singletons'
import type {
  IDashboard,
} from '@/model/dashboard.model'
import type { IRequestParam } from '@/model/http.model'

export default class DashboardService {
  constructor(private readonly httpService: HttpService) {
  }

  protected readonly routes = {
    GETLIST: '/admin-dashboard',
   
   
  }

  public async getStatsList(params: IRequestParam[] = []): Promise<IDashboard[]> {
    return this.httpService.get<IDashboard[]>(this.routes.GETLIST, [{ key: 'limit', value: 100 }, ...params])
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
