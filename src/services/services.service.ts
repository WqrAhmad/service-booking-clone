import { AxiosError } from 'axios'
import { authService } from './_singletons'
import type HttpService from './http.service'
import type {
  IAddServicesRequest,
  IServices,
  IServicesResponse,
  IUpdateServicesRequest,
} from '@/model/services.model'
import type { IRequestParam } from '@/model/http.model'

export default class ServicesService {
  constructor(private readonly httpService: HttpService) {
  }

  protected readonly routes = {
    GETLIST: '/services',
    CREATE: '/services',
    UPDATE: '/services',
    DELETE: '/services',
    EDIT: '/services',
  }

  public async getServicesList(params: IRequestParam[] = []): Promise<IServices[]> {
    return this.httpService.get<IServices[]>(this.routes.GETLIST, [{ key: 'limit', value: 100 }, ...params])
  }

  public async addServices(payload: IAddServicesRequest): Promise<IServices> {
    return this.httpService.post<IServices, IAddServicesRequest>(this.routes.CREATE, payload)
  }
  public async getServicesById(userId: string): Promise<IServices[]> {
    return this.httpService.get<IServices[]>(`${this.routes.EDIT}/${userId}`)
  }
  public async updateServices(id: string, payload: IUpdateServicesRequest): Promise<IServicesResponse> {
    const response: IUpdateServicesRequest = await this.httpService.put<IServicesResponse, IUpdateServicesRequest>(
      `${this.routes.UPDATE}/${id}`,
      payload,
    )

    return response
  }

  public async deleteServices(regionId: string): Promise<IServices> {
    return this.httpService.delete<IServices>(`${this.routes.DELETE}/${regionId}`)
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
