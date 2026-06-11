import { AxiosError } from 'axios'
import { authService } from './_singletons'
import type HttpService from './http.service'
import type {
  IGeneralSetting,
} from '@/model/general-setting.model'

export default class GeneralSettingService {
  constructor(private readonly httpService: HttpService) {
  }

  protected readonly routes = {
    GET: '/general-settings',
    UPDATE: '/general-settings',
  }


  public async fetchGeneralData(): Promise<IGeneralSetting> {
    return this.httpService.get<IGeneralSetting>(this.routes.GET)
  }

  public async updateGeneralSetting(payload: IGeneralSetting): Promise<IGeneralSetting> {
    const response: IGeneralSetting = await this.httpService.post<IGeneralSetting, IGeneralSetting>(
      `${this.routes.UPDATE}`,
      payload,
    )
    return response
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
