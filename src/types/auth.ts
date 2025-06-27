export interface IGoogleCallbackRequest {
  code: string;
  state: string;
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
  role: IRole;
}

export interface IGoogleCallbackResponse {
  user: IGoogleCallBackUser;
  returnUrl: string;
}

export interface IGoogleSilentCallbackRequest {
  code: string;
}

export interface IGoogleSilentCallbackResponse {
  idToken: string;
}

export interface JwtPayload {
  sub: string;
  name: string;
  email?: string;
  avatar?: string;
  role: IRole;
  exp: number;
}

export enum IRole {
  USER = 'user',
  ADMIN = 'admin'
}

export interface IVerifyTokenResponse {
  user: {
    id: string;
    email: string;
    displayName: string;
    avatarUrl: string;
    role: IRole;
  };
}

export interface IChannel {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface IGetChannelByUserIdResponse {
  channel: IChannel;
}

export interface ISearchChannelsResponse {
  channels: IChannel[];
  totalCount: number;
  page: number;
  limit: number;
}

export interface IGetChannelSubscribersCountResponse {
  totalCount: number;
}

export interface IGetSubscribedChannelsResponse {
  channels: IChannel[];
  totalCount: number;
  page: number;
  limit: number;
}