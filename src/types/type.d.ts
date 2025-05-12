export { };

declare global {
  interface HttpResponse<T> {
    data: T;
    message: string;
    statusCode: number;
    meta?: any;
  }
}