import { AxiosError } from 'axios'
import { authService } from './_singletons'
import type HttpService from './http.service'
import type {
  IAddStaffRequest,
  IStaff,
  IStaffResponse,
  IUpdateStaffRequest,
} from '@/model/staff.model'
import type { IRequestParam } from '@/model/http.model'

export default class StaffService {
  constructor(private readonly httpService: HttpService) {
  }

  protected readonly routes = {
    GETLIST: '/managers',
    CREATE: '/managers',
    UPDATE: '/managers',
    DELETE: '/managers',
    EDIT: '/managers',
    GETPERMISSIONS: '/get-permissions',
  }

  public async getStaffList(params: IRequestParam[] = []): Promise<IStaff[]> {
    return this.httpService.get<IStaff[]>(this.routes.GETLIST, [{ key: 'limit', value: 100 }, ...params])
  }

  public async getPermissions(): Promise<any[]> {
    return this.httpService.get<any[]>(this.routes.GETPERMISSIONS)
  }
  public async addStaff(payload: IAddStaffRequest): Promise<IStaff> {
    return this.httpService.post<IStaff, IAddStaffRequest>(this.routes.CREATE, payload)
  }
  public async getStaffById(userId: string): Promise<IStaff[]> {
    return this.httpService.get<IStaff[]>(`${this.routes.EDIT}/${userId}`)
  }
  public async updateStaff(id: string, payload: IUpdateStaffRequest): Promise<IStaffResponse> {
    const response: IUpdateStaffRequest = await this.httpService.post<IStaffResponse, IUpdateStaffRequest>(
      `${this.routes.UPDATE}/${id}`,
      payload,
    )

    return response
  }

  public async deleteStaff(regionId: string): Promise<IStaff> {
    return this.httpService.delete<IStaff>(`${this.routes.DELETE}/${regionId}`)
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
