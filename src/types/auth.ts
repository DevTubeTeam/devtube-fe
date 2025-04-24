export interface IGoogleCallbackRequest {
  code: string;
}

export interface IGoogleCallBackToken {
  accessToken: string;
  refreshToken: string;
  idToken: string;
}

export interface IGoogleCallBackUser {
  id: string;
  avatarUrl: string;
  displayName: string;
  email: string;
  role: string;
}

export interface IGoogleCallbackResponse {
  tokens: IGoogleCallBackToken;
  user: IGoogleCallBackUser;
}

export interface ILogoutRequest {
  userId: string;
}

export interface IRefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}
