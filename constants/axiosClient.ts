import axios from "axios";
import { router } from "expo-router";

export const apiClient = axios.create({
  baseURL: "http://localhost:8080/api", // Thay đổi theo đúng cổng Backend của team bạn
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// REQUEST INTERCEPTOR: Tự động đính kèm Access Token vào header
apiClient.interceptors.request.use(
  async (config) => {
    // Để demo mượt mà trên Web, ta lấy từ localStorage (hoặc AsyncStorage nếu chạy Mobile)
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
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

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log("Access Token hết hạn! Đang gọi API làm mới token...");
        const refreshToken =
          typeof window !== "undefined"
            ? localStorage.getItem("refreshToken")
            : null;

        const res = await axios.post("http://localhost:8080/api/auth/refresh", {
          refreshToken,
        });

        if (res.status === 200) {
          const newAccessToken = res.data.accessToken;
          if (typeof window !== "undefined") {
            localStorage.setItem("accessToken", newAccessToken);
          }
          console.log("Làm mới Token thành công! Chạy lại request cũ...");
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error("Refresh Token cũng hết hạn! Ép buộc đăng xuất...");
        if (typeof window !== "undefined") {
          localStorage.clear();
        }
        router.replace("/login");
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
