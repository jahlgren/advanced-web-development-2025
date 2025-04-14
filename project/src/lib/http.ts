import axios, { AxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const httpGet = async <T = unknown>(url: string, config?: AxiosRequestConfig) => {
  const res = await api.get<T>(url, config);
  return res;
};

export const httpPost = async <T = unknown, D = any>(url: string, data: D, config?: AxiosRequestConfig) => {
  const res = await api.post<T>(url, data, config);
  return res;
};

export const httpPut = async <T = unknown, D = any>(url: string, data: D, config?: AxiosRequestConfig) => {
  const res = await api.put<T>(url, data, config);
  return res;
};

export const httpPatch = async <T = unknown, D = any>(url: string, data: D, config?: AxiosRequestConfig) => {
  const res = await api.patch<T>(url, data, config);
  return res;
};

export const httpDelete = async <T = unknown>(url: string, config?: AxiosRequestConfig) => {
  const res = await api.delete<T>(url, config);
  return res;
};
