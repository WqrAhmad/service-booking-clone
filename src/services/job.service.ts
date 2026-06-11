import { AxiosError } from 'axios'
import { authService } from './_singletons'
import type HttpService from './http.service'
import type {
  IAddJobRequest,
  IJob,
  IJobResponse,
  IUpdateJobRequest,
} from '@/model/job.model'
import type { IRequestParam } from '@/model/http.model'

export default class JobService {
  constructor(private readonly httpService: HttpService) {
  }

  protected readonly routes = {
    GETLIST: '/jobs',
    GETJOBSEARCHLIST: '/jobs/search-mappers',
    CREATE: '/jobs',
    UPDATE: '/jobs',
    DELETE: '/jobs',
    EDIT: '/jobs',
    UPDATESTATUS: '/jobs/update-status',
    PDF: '/jobs/invoice-pdf',
    SEARCHPOSTCODE: '/postcode/autocomplete',
    SEARCHPOSTCODEDETAIL: '/postcode/details',
    SHAREONWHATSAPP: '/invoice/send-whatsapp',
  }

  public async getJobList(params: IRequestParam[] = []): Promise<IJob[]> {
    return this.httpService.get<IJob[]>(this.routes.GETLIST, [{ key: 'limit', value: 100 }, ...params])
  }
  public async getPostCode(params: IRequestParam[] = []): Promise<IJob[]> {
    return this.httpService.get<IJob[]>(this.routes.SEARCHPOSTCODE, [{ key: 'limit', value: 100 }, ...params])
  }
  public async getPostCodeDetail(params: IRequestParam[] = []): Promise<IJob[]> {
    return this.httpService.get<IJob[]>(this.routes.SEARCHPOSTCODEDETAIL, [{ key: 'limit', value: 100 }, ...params])
  }

  public async getJobSearchList(params: IRequestParam[] = []): Promise<IJob[]> {
    return this.httpService.get<IJob[]>(this.routes.GETJOBSEARCHLIST, [{ key: 'limit', value: 100 }, ...params])
  }
  public async addJob(payload: IAddJobRequest): Promise<IJob> {
    return this.httpService.post<IJob, IAddJobRequest>(this.routes.CREATE, payload)
  }
  public async shareOnWhatsApp(payload: IAddJobRequest): Promise<IJob> {
    return this.httpService.post<IJob, IAddJobRequest>(this.routes.SHAREONWHATSAPP, payload)
  }
  public async getJobById(userId: string): Promise<IJob[]> {
    return this.httpService.get<IJob[]>(`${this.routes.EDIT}/${userId}`)
  }
  public async getpdfById(userId: string): Promise<IJob[]> {
    return this.httpService.get<IJob[]>(`${this.routes.PDF}/${userId}`)
  }
  public async updateJob(id: string, payload: IUpdateJobRequest): Promise<IJobResponse> {
    const response: IUpdateJobRequest = await this.httpService.put<IJobResponse, IUpdateJobRequest>(
      `${this.routes.UPDATE}/${id}`,
      payload,
    )

    return response
  }
  public async updateStatus(id: string, payload: any): Promise<IJobResponse> {
    const response: any = await this.httpService.post<IJobResponse, any>(
      `${this.routes.UPDATESTATUS}/${id}`,
      payload,
    )
    return response
  }

  public async deleteJob(regionId: string): Promise<IJob> {
    return this.httpService.delete<IJob>(`${this.routes.DELETE}/${regionId}`)
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
