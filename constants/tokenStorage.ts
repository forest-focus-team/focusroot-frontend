import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

/**
 * Nguồn lưu token DUY NHẤT cho toàn app.
 *
 * Trước đây login.tsx lưu bằng `SecureStore` còn interceptor lại đọc `localStorage`
 * → trên mobile interceptor không thấy token (lệch nguồn). Helper này thống nhất:
 * - Web: `localStorage` (SecureStore không hỗ trợ web, sẽ ném lỗi).
 * - Native (iOS/Android): `expo-secure-store`.
 */

export const ACCESS_TOKEN = "accessToken";
export const REFRESH_TOKEN = "refreshToken";

const isWeb = Platform.OS === "web";

export async function getToken(key: string): Promise<string | null> {
  if (isWeb) {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(key);
  }
  return SecureStore.getItemAsync(key);
}

export async function setToken(key: string, value: string): Promise<void> {
  if (isWeb) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

export async function removeToken(key: string): Promise<void> {
  if (isWeb) {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(key);
    return;
  }
  await SecureStore.deleteItemAsync(key);
}

/** Lưu cả access + refresh token trong 1 lần (dùng sau login/refresh). */
export async function saveTokens(
  accessToken: string,
  refreshToken: string,
): Promise<void> {
  await Promise.all([
    setToken(ACCESS_TOKEN, accessToken),
    setToken(REFRESH_TOKEN, refreshToken),
  ]);
}

/** Xoá toàn bộ token (dùng khi logout / refresh thất bại). */
export async function clearTokens(): Promise<void> {
  await Promise.all([removeToken(ACCESS_TOKEN), removeToken(REFRESH_TOKEN)]);
}
