export interface GoogleCallbackRequest {
  code: string;
}

export interface GoogleCallbackResponse {
  accessToken: string;
  refreshToken?: string;
}
