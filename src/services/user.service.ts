import type HttpService from './http.service'
import type { IRequestParam } from '@/model/http.model'
import type {
  IAddUserRequest,
  IUpdateUserRequest,
  IUser,
  IUserToggle
} from '@/model/user.model'

export default class UserService {
  constructor(private readonly httpService: HttpService) {}

  public async getCurrentUser(): Promise<IUser> {
    return this.httpService.get<IUser>('user')
  }

  protected readonly routes = {
    GETLIST: '/mappers',
    TOGGLEAVAILABILITY: '/toggle-availability',
    CREATE: '/users',
    UPDATE: '/mappers',
    UPDATEPROFILE: '/profile-setup',
    EDIT: '/mappers',
    DELETE: '/users',
  }

  public async getUserList(params: IRequestParam[] = []): Promise<IUser[]> {
    return this.httpService.get<IUser[]>(this.routes.GETLIST, [{ key: 'limit', value: 100 }, ...params])
  }

  public async addUser(payload: IAddUserRequest): Promise<IUser> {
    return this.httpService.post<IUser, IAddUserRequest>(this.routes.CREATE, payload)
  }

  public async getUserById(userId: string): Promise<IUser[]> {
    return this.httpService.get<IUser[]>(`${this.routes.EDIT}/${userId}`)
  }
  public async toggleAvailability(userId: string): Promise<IUserToggle[]> {
    return this.httpService.post<IUserToggle[], { someData: string }>(
      `${this.routes.TOGGLEAVAILABILITY}/${userId}`,
      { someData: 'value' }
    )
  }
  
  public async updateUser(id: any, payload: IUpdateUserRequest): Promise<IUser> {
    // Log payload details for debugging
    if (payload instanceof FormData) {
      console.log('FormData entries:')
      for (const [key, value] of payload.entries()) {
        console.log(`${key}:`, value)
      }
    } else {
      console.log('Payload object:', payload)
    }
    
    return await this.httpService.post<IUser, IUpdateUserRequest>(
      `${this.routes.UPDATE}/${id}`,
      payload,
    )
  }
  public async updateProfile(id: any, payload: IUpdateUserRequest): Promise<IUser> {
    // Log payload details for debugging
    if (payload instanceof FormData) {
      console.log('FormData entries:')
      for (const [key, value] of payload.entries()) {
        console.log(`${key}:`, value)
      }
    } else {
      console.log('Payload object:', payload)
    }
    
    return await this.httpService.post<IUser, IUpdateUserRequest>(
      `${this.routes.UPDATEPROFILE}/${id}`,
      payload,
    )
  }

  public async deleteUser(UserId: string): Promise<IUser> {
    return this.httpService.delete<IUser>(`${this.routes.DELETE}/${UserId}`)
  }
}
