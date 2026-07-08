import { Stack } from "expo-router";

export default function RootLayout() {
  // Không khai báo cứng từng <Stack.Screen> — expo-router tự phát hiện route
  // ((auth)/login, (auth)/register, (tabs), settings, modal…). Guard đăng nhập
  // nằm ở Home ((tabs)/index): thiếu token → điều hướng về /login.
  return <Stack screenOptions={{ headerShown: false }} />;
}
