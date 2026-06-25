import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const [userData] = useState<any>({
    name: "Điệp",
    totalFocusTime: 120,
    currentSession: 45,
  });

  // KHÓA ĐIỀU HƯỚNG: Kiểm tra đăng nhập ngay khi mở app
  useEffect(() => {
    const timer = setTimeout(() => {
      if ((global as any).is_login_success !== "true") {
        router.replace("/login" as any);
      }
    }, 100); // Delay 100ms để tránh xung đột luồng của Expo Router
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header Chào mừng */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Xin chào 👋</Text>
            <Text style={styles.usernameText}>
              Chào {userData?.name || "Điệp"}!
            </Text>
          </View>

          <View style={{ flexDirection: "row", gap: 15 }}>
            {/* NÚT TEST 401 */}
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  "Lỗi 401",
                  "Refresh Token đã hết hạn! Vui lòng đăng nhập lại.",
                );
                (global as any).is_login_success = "false";
                router.replace("/login" as any);
              }}
              style={{
                alignItems: "center",
                backgroundColor: "#b91c1c",
                padding: 8,
                borderRadius: 8,
              }}
            >
              <MaterialCommunityIcons
                name="shield-alert"
                size={20}
                color="#fff"
              />
              <Text style={{ color: "#fff", fontSize: 10, marginTop: 2 }}>
                Test 401
              </Text>
            </TouchableOpacity>

            {/* Nút Đăng xuất */}
            <TouchableOpacity
              onPress={() => {
                (global as any).is_login_success = "false";
                router.replace("/login" as any);
              }}
              style={{ alignItems: "center", padding: 8 }}
            >
              <FontAwesome5 name="sign-out-alt" size={22} color="#fff" />
              <Text style={{ color: "#fff", fontSize: 10, marginTop: 2 }}>
                Đăng xuất
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Khối Tiến độ Tập trung */}
        <View style={styles.progressCard}>
          <Text style={styles.cardTitle}>Tiến độ tập trung tuần này</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <FontAwesome5 name="clock" size={20} color="#064e3b" />
              <Text style={styles.statValue}>
                {userData.totalFocusTime} phút
              </Text>
              <Text style={styles.statLabel}>Tổng thời gian</Text>
            </View>
            <View style={styles.statBox}>
              <MaterialCommunityIcons name="seed" size={22} color="#064e3b" />
              <Text style={styles.statValue}>
                {userData.currentSession} phút
              </Text>
              <Text style={styles.statLabel}>Phiên hiện tại</Text>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: "70%" }]} />
          </View>
          <Text style={styles.progressPercent}>Đã hoàn thành 70% mục tiêu</Text>
        </View>

        {/* Khối Hoạt động Gần đây */}
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Hoạt động gần đây</Text>
          <View style={styles.activityItem}>
            <MaterialCommunityIcons
              name="tree"
              size={24}
              color="#fff"
              style={styles.activityIcon}
            />
            <View>
              <Text style={styles.activityText}>
                Đã trồng thành công Cây Thông
              </Text>
              <Text style={styles.activityTime}>
                2 giờ trước • Tập trung 25 phút
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#064e3b", paddingTop: 50 },
  scrollContainer: { padding: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  welcomeText: { fontSize: 16, color: "#e2e8f0", opacity: 0.8 },
  usernameText: { fontSize: 26, fontWeight: "bold", color: "#ffffff" },
  progressCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statBox: { alignItems: "center", width: (width - 100) / 2 },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#064e3b",
    marginTop: 5,
  },
  statLabel: { fontSize: 12, color: "#64748b", marginTop: 2 },
  progressContainer: {
    height: 10,
    backgroundColor: "#e2e8f0",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressBar: { height: "100%", backgroundColor: "#064e3b" },
  progressPercent: { fontSize: 12, color: "#64748b", textAlign: "right" },
  recentSection: { marginTop: 5 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 15,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
  },
  activityIcon: { marginRight: 15, width: 24, textAlign: "center" },
  activityText: { fontSize: 15, fontWeight: "600", color: "#ffffff" },
  activityTime: { fontSize: 12, color: "#cbd5e1", marginTop: 2 },
});
