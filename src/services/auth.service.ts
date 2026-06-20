import { AxiosError } from 'axios'

// import { toRefs } from 'vue'
// import { storeToRefs } from 'pinia'
import type {
  IForgotPasswordRequest,
  IForgotPasswordResponse,
  ILoginRequest,
  ILoginResponse,
  ILogoutRequest,
  IOptRequest,
  IOptResponse,
  IResetPasswordRequest,
  ISignUpRequest,
  ISignUpResponse,
  IUpdatePasswordRequest,
  IUpdateProfileRequest,
} from '../model/auth.model'
import { notificationService } from './_singletons'
import HttpService from './http.service'

// import { $ResetPinia } from 'your-pinia-reset-module';
import { useAppStore } from '@/stores/index'

export default class AuthService {
  protected readonly routes = {
    LOGIN: '/login',
    SIGNUP: '/register',
    REGISTER_OTP: '/verify-mapper-otp',
    REGISTER_MAPPER: '/register-staff',
    LOGOUT: '/logout',
    FORGOT_PASSWORD: '/send-password-reset-code',
    RESET_PASSWORD: '/password-reset',
    VerifyOPT: '/verify-code',
    UPDATEPASSWORD: '/update-password',
    UPDATEPROFILE: '/update-profile',
  }

  constructor(protected readonly httpService: HttpService) {
    httpService.axios.interceptors.response.use(response => response, this.onRejected.bind(this))
  }

  private static setLocalStorageToken(isRememberMe: boolean, token: string): void {
    if (isRememberMe) {
      console.log('local')
      localStorage.setItem('token', token)
    }
    else {
      console.log('session')

      // sessionStorage.setItem('token', token);
    }
  }

  public async onRejected(error: AxiosError | unknown): Promise<void> {
    if (
      error instanceof AxiosError
      && error?.response?.status
      && [401, 403].includes(error.response.status)
    ) {
      notificationService.showError(error.response.data.message)

      const authLocal: string | null = localStorage.getItem('token')
      const authSession: string | null = sessionStorage.getItem('token')
      const isAuthorized = Boolean(authLocal || authSession)
      if (isAuthorized) {
        await this.logout()

        return window.location.replace('/login')
      }
    }

    return Promise.reject(error)
  }

  public async login(login: string, password: string, rememberMe: boolean):
    Promise<ILoginResponse> {
    const response: ILoginResponse = await this.httpService.post<ILoginResponse, ILoginRequest>(this.routes.LOGIN, {
      login,
      password,
      rememberMe,
    })

    const ResUser: any = response.data.user
    useAppStore().setUser(ResUser)
    const token: any = response.data.access_token
    await this.httpService.setToken(token)
    await AuthService.setLocalStorageToken(rememberMe, token)
    useAppStore().setUser(ResUser)
    useAppStore().setLogin()
    return response
  }


  public async signUp(payload: ISignUpRequest): Promise<ISignUpResponse> {
    const response: ISignUpResponse = await this.httpService.post<ISignUpResponse, ISignUpRequest>(
      this.routes.SIGNUP,
      payload,
    )
    return response
  }
  public async registerMapper(payload: ISignUpRequest): Promise<ISignUpResponse> {
    const response: ISignUpResponse = await this.httpService.post<ISignUpResponse, ISignUpRequest>(
      this.routes.REGISTER_MAPPER,
      payload,
    )
    return response
  }
  public async resgisterOTP(payload: ISignUpRequest): Promise<ISignUpResponse> {
    const response: ISignUpResponse = await this.httpService.post<ISignUpResponse, ISignUpRequest>(
      this.routes.REGISTER_OTP,
      payload,
    )
    const ResUser: any = response.data.user
    useAppStore().setUser(ResUser)
    const token: any = response.data.access_token
    const rememberMe: any = false
    await this.httpService.setToken(token)
    await AuthService.setLocalStorageToken(rememberMe, token)
    useAppStore().setUser(ResUser)
    useAppStore().setLogin()

    return response;
  }
  public async sendOpt(code: string, email: string): Promise<IOptResponse> {
    const response: IOptResponse = await this.httpService.post<IOptResponse, IOptRequest>(this.routes.VerifyOPT, {
      code,
      email,
    })

    return response
  }
  public async logout(): Promise<void> {
    const token = HttpService.getToken()

    console.log('tok', token)
    if (!token) {
      useAppStore().setUser({})
      window.location.href = '/'

      return
    }
    try {
      await this.httpService.post<[false], ILogoutRequest>(this.routes.LOGOUT, {
        token,
      })

      // const resetPinia = $ResetPinia()

      // resetPinia.all()

      const myStore = useAppStore()

      myStore.$reset() // \
      useAppStore().setUser({}) // \
    }
    finally {
      sessionStorage.removeItem('token')
      localStorage.removeItem('token')

      useAppStore().setUser({})
      window.location.href = '/login'
      setTimeout(() => {
        useAppStore().setLogout()
      }, 500)
    }
  }

  public async forgotPassword(email: string): Promise<IForgotPasswordResponse> {
    return this.httpService.post<IForgotPasswordResponse, IForgotPasswordRequest>(
      this.routes.FORGOT_PASSWORD,
      { email },
    )
  }

  // eslint-disable-next-line camelcase
  public async resetPassword(email: string, password: string, password_confirmation: string): Promise<void> {
    return this.httpService.post<void, IResetPasswordRequest>(this.routes.RESET_PASSWORD, {
      email,
      password,
      password_confirmation,
    })
  }
  public async updatePassword(payload: any): Promise<void> {
    return this.httpService.post<void, IUpdatePasswordRequest>(this.routes.UPDATEPASSWORD, payload)
  }
  public async updateProfile(payload: any): Promise<void> {
    return this.httpService.post<void, IUpdateProfileRequest>(this.routes.UPDATEPROFILE,
      payload)
  }
}
