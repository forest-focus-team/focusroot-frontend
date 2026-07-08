import axios from "axios";
import { router } from "expo-router";
import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  clearTokens,
  getToken,
  saveTokens,
  setToken,
} from "./tokenStorage";

export const API_BASE_URL = "http://localhost:8080/api"; // Đổi sang IP LAN nếu chạy trên thiết bị thật

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// REQUEST INTERCEPTOR: Tự động đính kèm Access Token vào header (đọc từ tokenStorage — web + native)
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getToken(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// RESPONSE INTERCEPTOR: Tự động gọi Refresh Token khi lỗi 401 xảy ra
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log("Access Token hết hạn! Đang gọi API làm mới token...");
        const refreshToken = await getToken(REFRESH_TOKEN);

        // BE bọc mọi response trong ApiResponse<T> → token nằm ở res.data.data
        const res = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const data = res.data?.data;
        const newAccessToken = data?.accessToken;
        const newRefreshToken = data?.refreshToken;

        if (res.status === 200 && newAccessToken) {
          // BE cấp lại CẢ access + refresh token mới → lưu cả hai
          if (newRefreshToken) {
            await saveTokens(newAccessToken, newRefreshToken);
          } else {
            await setToken(ACCESS_TOKEN, newAccessToken);
          }
          console.log("Làm mới Token thành công! Chạy lại request cũ...");
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        }
        throw new Error("Refresh response không hợp lệ");
      } catch (refreshError) {
        console.error("Refresh Token cũng hết hạn! Ép buộc đăng xuất...");
        await clearTokens();
        router.replace("/login");
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
