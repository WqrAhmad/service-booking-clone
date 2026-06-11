import type HttpService from './http.service';

interface AddPaymentRequest {
  amount: number | string;
  job_id: number | string;
  payment_method: string;
}

interface AddPaymentResponse {
  message: string;
  [key: string]: unknown;
}

interface PaymentJobDetails {
  id: number | string;
  job_number?: string;
  service?: { name: string };
  platform_fee?: number;
  amount?: number;
}

export default class PaymentService {
  constructor(private readonly httpService: HttpService) {}

  protected readonly routes = {
    CREATE: '/payments',
    GET_JOB_DETAILS: '/payments/job-details',
    MANUALLY: '/payments/manually',
  };

  public async add(payload: AddPaymentRequest): Promise<AddPaymentResponse> {
    return this.httpService.post<AddPaymentResponse, AddPaymentRequest>(this.routes.CREATE, payload);
  }

  public async manuallyPayment(payload: any): Promise<any> {
    return this.httpService.post<any, any>(this.routes.MANUALLY, payload);
  }
  public async getJobDetails(jobId: string): Promise<PaymentJobDetails> {
    return this.httpService.get<PaymentJobDetails>(`${this.routes.GET_JOB_DETAILS}/${jobId}`);
  }
}

