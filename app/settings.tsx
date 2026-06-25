import { useRouter } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function SettingsScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        ⚙️ Màn Hình Cài Đặt Hệ Thống (Wireframe 8)
      </Text>
      <Text style={styles.subtitle}>
        Tùy chỉnh giao diện, thông báo và cấu hình tài khoản cá nhân.
      </Text>
      <View style={{ marginTop: 20, width: "60%" }}>
        <Button title="← Quay lại" color="gray" onPress={() => router.back()} />
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
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 14, color: "gray" },
});
