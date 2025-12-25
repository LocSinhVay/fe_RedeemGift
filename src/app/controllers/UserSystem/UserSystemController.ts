import ApiService from "../../services/ApiService";

export const getUserSystemPagedList = (query: string) => {
  const queryParams = Object.fromEntries(new URLSearchParams(query));
  return new ApiService('/systemUser/UserSystemGetPagedList', 'get', true).request({}, queryParams);
};

export const getAllRole = () => {
  return new ApiService('/systemUser/GetAllRole', 'get').request();
};

export const getNewUsername = (symbol: string) => {
  return new ApiService('/systemUser/GetNewUsername', 'get', true).request({}, { symbol });
};

export const exportUserSystem = (queryParams: Record<string, any>) => {
  return new ApiService('/systemUser/Export', 'get', true).requestPdf({}, queryParams);
};

export const insertUserSystem = (formData: FormData) => {
  return new ApiService('/systemUser/Insert', 'post').requestMultipart(formData);
};

export const updateUserSystem = (formData: FormData) => {
  return new ApiService('/systemUser/Update', 'post').requestMultipart(formData);
};

export const deleteUserSystem = (UserID: number) => {
  return new ApiService('/systemUser/Delete', 'post').request({ UserID });
};

export const resetPassword = (UserID: number) => {
  return new ApiService('/systemUser/UpdatePassword', 'post').request({ UserID });
};

export const changePassword = (Password: string, NewPassword: string, ConfirmNewPassword: string, IsReset: boolean) => {
  return new ApiService('/systemUser/UpdatePassword', 'post').request({ Password, NewPassword, ConfirmNewPassword, IsReset });
};

// --AccountType
// export const getViewAccountTypePagedList = (query: string) => {
//   const queryParams = Object.fromEntries(new URLSearchParams(query));
//   return new ApiService('/systemUser/ViewAccountTypeGetPagedList', 'get', true).request({}, queryParams);
// };

// export const insertAccountType = (formData: FormData) => {
//   return new ApiService('/systemUser/InsertAccountType', 'post').requestMultipart(formData);
// };

// export const updateAccountType = (formData: FormData) => {
//   return new ApiService('/systemUser/UpdateAccountType', 'post').requestMultipart(formData);
// };

// export const updateAccountTypeStatus = (queryParams: Record<string, any>) => {
//   return new ApiService('/systemUser/UpdateAccountTypeStatus', 'post', true).request({}, queryParams);
// };

// export const getAllAccountType = () => {
//   return new ApiService('/systemUser/AccountTypeGetAll', 'get').request();
// };

// Sup
// export const getListSup = () => {
//   return new ApiService('/systemUser/SupGetList', 'get').request();
// };
