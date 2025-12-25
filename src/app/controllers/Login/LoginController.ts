import ApiService from "../../services/ApiService";

export const login = (username: string, password: string) => {
  const response = new ApiService('/login/Login', 'post').request({
    Username: username,
    Password: password
  });
  return response; // Trả về phần Data của API response
};

export const sendRequestReset = (Email: string) => {
  return new ApiService('/login/SendRequest', 'post').request({ Email });
};

export const recoveryPassword = (UserId: string, Token: string, NewPassword: string) => {
  return new ApiService('/login/RecoveryPassword', 'post').request({ UserId, Token, NewPassword });
};