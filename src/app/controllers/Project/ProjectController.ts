import ApiService from "../../services/ApiService";

//#region Project
export const getProjectPagedList = (query: string) => {
  const queryParams = Object.fromEntries(new URLSearchParams(query));
  return new ApiService('/project/ProjectGetPagedList', 'get', true).request({}, queryParams);
};

export const insertProject = (formData: FormData) => {
  return new ApiService('/project/InsertProject', 'post').requestMultipart(formData);
};

export const updateProject = (formData: FormData) => {
  return new ApiService('/project/UpdateProject', 'post').requestMultipart(formData);
};

export const updateProjectStatus = (queryParams: Record<string, any>) => {
  return new ApiService('/project/UpdateProjectStatus', 'post', true).request({}, queryParams);
};

export const getAllProject = () => {
  return new ApiService('/project/getAllProject', 'get').request();
};
//#endregion