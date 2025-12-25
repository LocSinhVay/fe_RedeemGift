import ApiService from "../../services/ApiService";

//#region Gift APIs
export const getGiftPagedList = (query: string) => {
  const queryParams = Object.fromEntries(new URLSearchParams(query));
  return new ApiService('/gift/GiftGetPagedList', 'get', true).request({}, queryParams);
};

export const insertGift = (formData: FormData) => {
  return new ApiService('/gift/InsertGift', 'post').requestMultipart(formData);
};

export const updateGift = (formData: FormData) => {
  return new ApiService('/gift/UpdateGift', 'post').requestMultipart(formData);
};

export const updateGiftStatus = (queryParams: Record<string, any>) => {
  return new ApiService('/gift/UpdateGiftStatus', 'post', true).request({}, queryParams);
};
//#endregion