import { useRouter } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function DetailScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ℹ️ Màn Hình Chi Tiết Dự Án (Wireframe 7)</Text>
      <Text style={styles.subtitle}>
        Hiển thị thông tin chuyên sâu của mục tiêu được chọn.
      </Text>
      <View style={{ marginTop: 20, width: "60%" }}>
        <Button
          title="← Quay lại Trang Chủ"
          color="gray"
          onPress={() => router.back()}
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
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 14, color: "gray" },
});
