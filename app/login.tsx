import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ Email và Mật khẩu!");
      return;
    }

    const savedEmail = (global as any).saved_email;
    const savedPassword = (global as any).saved_password;

    if (email === savedEmail && password === savedPassword) {
      (global as any).is_login_success = "true";
      router.replace("/(tabs)" as any); // Bắn thẳng vào hệ thống Tab
    } else {
      Alert.alert(
        "Đăng nhập thất bại",
        "Email hoặc Mật khẩu không chính xác! Vui lòng kiểm tra lại.",
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xin chào 👋</Text>
      <Text style={styles.subtitle}>Chào Điệp!</Text>

      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>ĐĂNG NHẬP VIA APP</Text>
        </TouchableOpacity>
      </View>

      {/* Sửa lại đoạn này thành router.push để chuyển mượt sang trang Đăng ký */}
      <TouchableOpacity onPress={() => router.push("/register" as any)}>
        <Text style={styles.linkText}>Chưa có tài khoản? Đăng ký ngay</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#064e3b",
    justifyContent: "center",
    padding: 25,
  },
  title: { fontSize: 20, color: "#fff", textAlign: "center", opacity: 0.9 },
  subtitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 30,
  },
  card: { backgroundColor: "#fff", padding: 20, borderRadius: 15 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#064e3b",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  linkText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 15,
    opacity: 0.8,
    textDecorationLine: "underline",
  },
});
