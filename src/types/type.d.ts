type HttpResponse<T> = {
  statusCode: number;
  status: boolean;
  message: string;
  payload: T;
  dateTime: string;
  error: string;
};
