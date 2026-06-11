import { AxiosError } from 'axios'
import { notificationService } from '@/services/_singletons'
export const handleApiError = async (e: any) => {
     if (e instanceof AxiosError && e.response?.status === 422) {
      notificationService.showError(e.response.data.message)

      return
    }
    if (e instanceof AxiosError && e.response?.status === 401)
      notificationService.showError(e.response.data.message)
}