// Payload gửi lên server khi đăng nhập bằng Google
export interface GoogleLoginRequest {
  token: string;
}

// Response từ server sau khi đăng nhập thành công
export interface GoogleLoginResponse {
  accessToken: string;
}
