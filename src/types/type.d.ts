export { };

declare global {
  interface HttpResponse<T> {
    data: T;
    message: string;
    statusCode: number;
    status: boolean;
    statusDetail?: string
    meta?: any;
  }
}