import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { apiClient } from "../../constants/axiosClient";
import { ACCESS_TOKEN, clearTokens, getToken } from "../../constants/tokenStorage";

type StatsSummary = {
  totalSessions: number;
  successSessions: number;
  failedSessions: number;
  successRate: number;
  totalFocusMinutes: number;
  currentCoins: number;
  totalCoinsEarned: number;
  totalTreesPlanted: number;
  aliveTreesCount: number;
  deadTreesCount: number;
  currentStreak: number;
};

type FocusSession = {
  id: number;
  status: string;
  plannedDuration: number;
  actualDuration?: number;
  coinEarned?: number;
};

export default function HomeScreen() {
  const router = useRouter();

  const [stats, setStats] = useState<StatsSummary | null>(null);
  const [speciesId, setSpeciesId] = useState<number | null>(null);
  const [activeSession, setActiveSession] = useState<FocusSession | null>(null);
  const [duration, setDuration] = useState("5");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const loadStats = useCallback(async () => {
    const res = await apiClient.get("/stats/summary");
    setStats(res.data.data);
  }, []);

  // Guard bằng token + nạp dữ liệu mỗi khi màn Home được focus
  useFocusEffect(
    useCallback(() => {
      let alive = true;
      (async () => {
        const token = await getToken(ACCESS_TOKEN);
        if (!token) {
          router.replace("/login");
          return;
        }
        try {
          setLoading(true);
          const [, speciesRes] = await Promise.all([
            loadStats(),
            apiClient.get("/forest/species"),
          ]);
          if (!alive) return;
          const species = speciesRes.data.data;
          setSpeciesId(Array.isArray(species) && species.length ? species[0].id : null);
        } catch {
          // 401 sẽ được interceptor xử lý (refresh / đẩy về login)
        } finally {
          if (alive) setLoading(false);
        }
      })();
      return () => {
        alive = false;
      };
    }, [loadStats, router]),
  );

  const handleStart = async () => {
    const planned = parseInt(duration, 10);
    if (isNaN(planned) || planned < 5 || planned > 180) {
      Alert.alert("Thời lượng không hợp lệ", "Nhập số phút từ 5 đến 180.");
      return;
    }
    setBusy(true);
    try {
      const res = await apiClient.post("/sessions/start", {
        plannedDuration: planned,
        treeSpeciesId: speciesId,
      });
      setActiveSession(res.data.data);
    } catch (error: any) {
      Alert.alert(
        "Không bắt đầu được phiên",
        error.response?.data?.message || "Có thể bạn đang có một phiên chạy dở.",
      );
    } finally {
      setBusy(false);
    }
  };

  const handleEnd = async (giveUp: boolean) => {
    if (!activeSession) return;
    setBusy(true);
    try {
      const res = await apiClient.post(
        `/sessions/${activeSession.id}/end?giveUp=${giveUp}`,
      );
      const ended: FocusSession = res.data.data;
      setActiveSession(null);
      await loadStats();
      const ok = ended.status === "SUCCESS";
      Alert.alert(
        ok ? "🌳 Trồng cây thành công!" : "🥀 Cây đã héo",
        ok
          ? `Bạn tập trung ${ended.actualDuration ?? 0} phút, nhận ${ended.coinEarned ?? 0} coin.`
          : `Phiên kết thúc sớm (cần đủ ${ended.plannedDuration} phút). Cây vẫn được ghi vào rừng nhưng đã héo.`,
      );
    } catch (error: any) {
      Alert.alert(
        "Lỗi kết thúc phiên",
        error.response?.data?.message || "Vui lòng thử lại.",
      );
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = async () => {
    await clearTokens();
    router.replace("/login");
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Xin chào 👋</Text>
            <Text style={styles.usernameText}>Sẵn sàng tập trung?</Text>
          </View>
          <TouchableOpacity
            onPress={handleLogout}
            style={{ alignItems: "center", padding: 8 }}
          >
            <FontAwesome5 name="sign-out-alt" size={22} color="#fff" />
            <Text style={{ color: "#fff", fontSize: 10, marginTop: 2 }}>
              Đăng xuất
            </Text>
          </TouchableOpacity>
        </View>

        {/* Khối phiên tập trung */}
        <View style={styles.sessionCard}>
          {activeSession ? (
            <>
              <Text style={styles.cardTitle}>⏳ Đang trong phiên tập trung</Text>
              <Text style={styles.sessionInfo}>
                Mục tiêu: {activeSession.plannedDuration} phút
              </Text>
              <View style={styles.sessionButtons}>
                <TouchableOpacity
                  style={[styles.btn, styles.btnSuccess]}
                  onPress={() => handleEnd(false)}
                  disabled={busy}
                >
                  <Text style={styles.btnText}>Hoàn thành</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn, styles.btnDanger]}
                  onPress={() => handleEnd(true)}
                  disabled={busy}
                >
                  <Text style={styles.btnText}>Bỏ cuộc</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.cardTitle}>🌱 Bắt đầu một phiên mới</Text>
              <View style={styles.durationRow}>
                <Text style={styles.durationLabel}>Thời lượng (phút):</Text>
                <TextInput
                  style={styles.durationInput}
                  value={duration}
                  onChangeText={setDuration}
                  keyboardType="number-pad"
                  editable={!busy}
                />
              </View>
              <TouchableOpacity
                style={[styles.btn, styles.btnStart]}
                onPress={handleStart}
                disabled={busy}
              >
                {busy ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.btnText}>Bắt đầu tập trung</Text>
                )}
              </TouchableOpacity>
              <Text style={styles.hint}>
                Phiên thành công (cây sống + coin) cần tập trung đủ số phút đã đặt.
              </Text>
            </>
          )}
        </View>

        {/* Khối thống kê thật từ /stats/summary */}
        <View style={styles.progressCard}>
          <Text style={styles.cardTitleDark}>Thống kê của bạn</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <FontAwesome5 name="clock" size={20} color="#064e3b" />
              <Text style={styles.statValue}>
                {stats?.totalFocusMinutes ?? 0} phút
              </Text>
              <Text style={styles.statLabel}>Tổng tập trung</Text>
            </View>
            <View style={styles.statBox}>
              <FontAwesome5 name="coins" size={20} color="#d97706" />
              <Text style={styles.statValue}>{stats?.currentCoins ?? 0}</Text>
              <Text style={styles.statLabel}>Coin hiện có</Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <MaterialCommunityIcons name="tree" size={22} color="#064e3b" />
              <Text style={styles.statValue}>
                {stats?.aliveTreesCount ?? 0}/{stats?.totalTreesPlanted ?? 0}
              </Text>
              <Text style={styles.statLabel}>Cây sống / tổng</Text>
            </View>
            <View style={styles.statBox}>
              <MaterialCommunityIcons name="fire" size={22} color="#dc2626" />
              <Text style={styles.statValue}>{stats?.currentStreak ?? 0}</Text>
              <Text style={styles.statLabel}>Chuỗi ngày</Text>
            </View>
          </View>
          <Text style={styles.successRate}>
            Tỉ lệ thành công: {Math.round(stats?.successRate ?? 0)}% (
            {stats?.successSessions ?? 0}/{stats?.totalSessions ?? 0} phiên)
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#064e3b", paddingTop: 50 },
  center: { justifyContent: "center", alignItems: "center" },
  scrollContainer: { padding: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  welcomeText: { fontSize: 16, color: "#e2e8f0", opacity: 0.8 },
  usernameText: { fontSize: 24, fontWeight: "bold", color: "#ffffff" },
  sessionCard: {
    backgroundColor: "#0a5d46",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#fff", marginBottom: 15 },
  cardTitleDark: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 15,
  },
  sessionInfo: { color: "#d1fae5", fontSize: 14, marginBottom: 15 },
  sessionButtons: { flexDirection: "row", gap: 12 },
  durationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 15,
  },
  durationLabel: { color: "#d1fae5", fontSize: 14 },
  durationInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    width: 70,
    textAlign: "center",
    fontSize: 16,
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  btnStart: { backgroundColor: "#059669" },
  btnSuccess: { backgroundColor: "#059669" },
  btnDanger: { backgroundColor: "#b91c1c" },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  hint: { color: "#a7f3d0", fontSize: 12, marginTop: 12, fontStyle: "italic" },
  progressCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  statBox: { alignItems: "center", flex: 1 },
  statValue: { fontSize: 18, fontWeight: "bold", color: "#064e3b", marginTop: 5 },
  statLabel: { fontSize: 12, color: "#64748b", marginTop: 2 },
  successRate: {
    fontSize: 13,
    color: "#475569",
    textAlign: "center",
    marginTop: 5,
  },
});
