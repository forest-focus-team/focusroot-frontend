import { apiClient } from "@/constants/axiosClient";
import { useRouter } from "expo-router";
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
export default function RegisterScreen() {
  const router = useRouter();

  // 1. Quản lý trạng thái dữ liệu nhập và hiệu ứng Loading
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 2. Hàm xử lý gọi API Đăng ký thật (Yêu cầu số 4)
  const handleRegister = async () => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin đăng ký!");
      return;
    }

    setLoading(true); // Bật hiệu ứng loading khi đang gửi request
    try {
      await apiClient.post("/auth/register", {
        username: username.trim(),
        email: email.trim(),
        password: password,
      });

      Alert.alert(
        "Thành công",
        "Tạo tài khoản thành công! Hãy đăng nhập nhé.",
        [
          { text: "OK", onPress: () => router.back() }, // Quay lại màn Login sau khi tạo thành công
        ],
      );
    } catch (error: any) {
      // Bắt lỗi hệ thống hoặc email đã tồn tại (Yêu cầu số 7)
      const errorMsg =
        error.response?.data?.message ||
        "Đăng ký thất bại. Vui lòng kiểm tra lại kết nối mạng!";
      Alert.alert("Lỗi đăng ký", errorMsg);
    } finally {
      setLoading(false); // Tắt hiệu ứng loading
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 Màn Hình Đăng Ký (Hi-Fi)</Text>
      <Text style={styles.subtitle}>
        Tạo tài khoản mới cho thành viên đội ngũ FocusRoot.
      </Text>

      {/* Form nhập liệu */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nhập Tên tài khoản (Username)"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          editable={!loading}
        />
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
        {/* Hiện vòng xoay Loading khi đang gọi API, ngược lại hiện nút Đăng ký */}
        {loading ? (
          <ActivityIndicator size="large" color="#00E676" />
        ) : (
          <Button
            title="Đăng Ký Tài Khoản"
            color="#00E676"
            onPress={handleRegister}
          />
        )}

        <Button
          title="Đã có tài khoản? Đăng nhập"
          onPress={() => router.back()}
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
