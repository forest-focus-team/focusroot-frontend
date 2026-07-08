import { Href, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { apiClient } from "../../constants/axiosClient";
import { saveTokens } from "../../constants/tokenStorage";
export default function LoginScreen() {
  const router = useRouter();

  // 1. Quản lý trạng thái dữ liệu nhập và trạng thái Loading / Error (Yêu cầu số 7)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 2. Hàm xử lý gọi API Đăng nhập thật (Yêu cầu số 4)
  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ Email và Mật khẩu!");
      return;
    }

    setLoading(true); // Bật trạng thái loading khi bắt đầu kết nối API (Yêu cầu số 7)
    try {
      const response = await apiClient.post("/auth/login", {
        email: email.trim(),
        password: password,
      });

      // BE bọc mọi response trong ApiResponse<T> → token nằm ở response.data.data
      const { accessToken, refreshToken } = response.data.data;

      // Lưu qua tokenStorage (nguồn duy nhất, khớp với interceptor) — web + native
      await saveTokens(accessToken, refreshToken);

      Alert.alert("Thành công", "Đăng nhập thành công!", [
        { text: "OK", onPress: () => router.replace("/(tabs)" as Href) },
      ]);
    } catch (error: any) {
      // Xử lý lỗi kết nối mạng hoặc sai tài khoản mật khẩu từ Server (Yêu cầu số 7)
      const errorMsg =
        error.response?.data?.message ||
        "Không thể kết nối tới máy chủ. Vui lòng thử lại!";
      Alert.alert("Lỗi đăng nhập", errorMsg);
    } finally {
      setLoading(false); // Tắt trạng thái loading sau khi xử lý xong (Yêu cầu số 7)
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔑 Màn Hình Đăng Nhập (Hi-Fi)</Text>
      <Text style={styles.subtitle}>
        Kết nối với hệ thống quản lý FocusRoot.
      </Text>

      {/* Form nhập liệu */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nhập Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />
        <TextInput
          style={styles.input}
          placeholder="Nhập Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          editable={!loading}
        />
      </View>

      <View style={styles.buttonContainer}>
        {/* Hiện vòng xoay Loading khi đang gọi API, ngược lại hiện nút bấm thường */}
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Button title="Đăng Nhập" color="#4CAF50" onPress={handleLogin} />
        )}

        <Button
          title="Chưa có tài khoản? Đăng ký ngay"
          onPress={() => router.push("/(auth)/register" as Href)}
          disabled={loading}
        />
        <Button
          title="Quay lại Trang Chủ"
          color="gray"
          onPress={() => router.replace("/(tabs)" as Href)}
          disabled={loading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 14, color: "gray", marginBottom: 30 },
  formContainer: {
    width: "80%",
    marginBottom: 20,
    gap: 12,
  },
  input: {
    width: "100%",
    height: 45,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fafafa",
  },
  buttonContainer: { gap: 15, width: "80%" },
});
