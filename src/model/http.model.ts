export interface IStdResponse<T> {
  status: boolean;
  code: number;
  cache: boolean;
  isAvailableData: boolean;
  client: string;
  env: string;
  responseCode: number;
  errorMessage?: string;
  resource: T;
}

export interface IDbInfo {
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface IPagination<T> {
  total: number;
  current_page: number;
  last_page: number;
  per_page: number;
  to: number;
  entities: T[];
}

export interface IUbsendResponse<T> {
  hits: T;
  total: number;
  nextPageToken: string;
}

export interface IRequestParam {
  key: string;
  value: string | number;
}

export interface ICarrierRequestParam {
  ubsend_account_id:string;
}

export interface IPriceListRequestParam {
  ubsend_account_id:string;
  carrier:string;
}

export interface IPriceEditRequestParam {
  price_group_id:string;
  data:string;
}

export interface IAgreementPrListRequestParam {
  price_group_id:string;
}
export interface IAgreementByIdRequestParam {
  agreement_id:string;
}
export interface IAgreementPrGrpListRequestParam {
  carrier:string;
}
export interface IFileUploadResponse  {
  data: object;
}
export interface ITemplateRequestParam  {
  key: string;
  value: string | number;
  type: string;
}
