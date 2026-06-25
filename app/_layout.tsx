import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* 1. Đặt Login lên đầu tiên để làm màn hình mặc định khi khởi động */}
      <Stack.Screen name="login" />
      {/* 2. Màn hình Đăng ký */}
      <Stack.Screen name="register" />
      {/* 3. Cụm điều hướng Tab */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
