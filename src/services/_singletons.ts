import HttpService from './http.service';
import AuthService from './auth.service'
import LoadingService from './loading.service';
import LoggingService from './logging.service';
import NotificationService from './notification.service';
import GeneralSettingService from './general-setting.service'
import UserService from './user.service'
import ServicesService from './services.service'
import StaffService from './staff.service'
import JobService from './job.service'
import PaymentService from './payment.service'
import DashboardService from './dashboard.service'
import TermConditionService from './term-condition.service'




export const httpService: HttpService = new HttpService(import.meta.env.VITE_API_URL);
export const loadingService: LoadingService = new LoadingService();
export const userService: UserService = new UserService(httpService)
export const generalSettingService: GeneralSettingService = new GeneralSettingService(httpService)
export const authService: AuthService = new AuthService(httpService)
export const servicesService: ServicesService = new ServicesService(httpService)
export const staffService: StaffService = new StaffService(httpService)
export const jobService: JobService = new JobService(httpService)
export const paymentService: PaymentService = new PaymentService(httpService)
export const dashboardService: DashboardService = new DashboardService(httpService)
export const loggingService: LoggingService = new LoggingService();
export const notificationService: NotificationService = new NotificationService();
export const termConditionService: TermConditionService = new TermConditionService(httpService)
