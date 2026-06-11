import type { AxiosInstance } from 'axios'
import axios from 'axios'
import { set } from 'lodash-es'

// import { useRouter } from 'vue-router'
import type { IRequestParam } from '../model/http.model'
import { authService, notificationService } from './_singletons'
import HelperService from './helper.service'

// const router = useRouter()
export default class HttpService {
  /**
   * Axios instance
   */
  public readonly axios: AxiosInstance

  constructor(baseURL: string) {
    console.log(baseURL, 's')

    const token: string | null = HttpService.getToken()

    const config = {
      baseURL,
      headers: {
        Authorization: '',
      },

      // Apikey: import.meta.env.VITE_apiKey,

    }

    if (config.headers && token)
      config.headers.Authorization = `Bearer ${token}`

    this.axios = axios.create(config)

    this.axios.interceptors.response.use(response => {
      return response
    }, error => {
      if (error.request.status === 401) {
        //   useAppStore()._isLogIn = false;
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        authService.logout()
      }
      if ([422, 500].includes(error.response.status))
        notificationService.showError(error.response?.data?.message || error.message)

      return Promise.reject(error)
    })
  }

  public static getToken(): string | null {
    if (localStorage.getItem('token'))

      return localStorage.getItem('token') as string

    if (sessionStorage.getItem('token')) {
      console.log('sess')

      return sessionStorage.getItem('token') as string
    }

    return null
  }

  public setToken(token: string): void {
    localStorage.setItem('token', token)
    set(this.axios.defaults, 'headers.Authorization', `Bearer ${token}`)
    set(this.axios.defaults, 'headers.Access-Control-Allow-Origin', '*')
    set(this.axios.defaults, 'mode', 'cors')
  }

  public removeToken(): void {
    set(this.axios.defaults, 'headers.Authorization', undefined)
  }

  public static generateFilter(filter: IRequestParam[]): string {
    let filterString = ''
    filter.forEach((param: IRequestParam) => {
      filterString += filterString.length === 0 ? '?' : '&'
      filterString += `${param.key}=${param.value}`
    })

    return filterString
  }

  public async get<T>(url: string, params?: IRequestParam[]): Promise<T> {
    let requestURI = url

    if (params)
      requestURI += HttpService.generateFilter(params)

    return HelperService.unwrapAxiosResponse(this.axios.get<T>(requestURI))
  }

  public async post<T, P>(url: string, payload?: P, params?: IRequestParam[]): Promise<T> {
    let requestURI = url

    if (params)
      requestURI += HttpService.generateFilter(params)

    return HelperService.unwrapAxiosResponse(this.axios.post<T>(requestURI, payload))
  }

  public async patch<T, P>(url: string, payload?: P, params?: IRequestParam[]): Promise<T> {
    let requestURI = url

    if (params)
      requestURI += HttpService.generateFilter(params)

    return HelperService.unwrapAxiosResponse(this.axios.patch<T>(requestURI, payload))
  }

  public async put<T, P>(url: string, payload?: P, params?: IRequestParam[]): Promise<T> {
    let requestURI = url

    if (params)
      requestURI += HttpService.generateFilter(params)

    return HelperService.unwrapAxiosResponse(this.axios.put<T>(requestURI, payload))
  }

  public async delete<T>(url: string, params?: IRequestParam[]): Promise<T> {
    let requestURI = url

    if (params)
      requestURI += HttpService.generateFilter(params)

    return HelperService.unwrapAxiosResponse(this.axios.delete<T>(requestURI))
  }
}
