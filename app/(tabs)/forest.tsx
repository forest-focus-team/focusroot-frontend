import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiClient } from "../../constants/axiosClient";

type TreeSpecies = {
  name?: string;
  imageUrl?: string;
};

type MyForestItem = {
  id: number;
  treeSpecies?: TreeSpecies;
  plantedAt?: string;
  isAlive?: boolean;
};

const FALLBACK_IMG = "https://cdn-icons-png.flaticon.com/512/490/490154.png";

function formatDate(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}`;
}

export default function ForestScreen() {
  const [trees, setTrees] = useState<MyForestItem[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      (async () => {
        try {
          setLoading(true);
          const res = await apiClient.get("/forest");
          if (alive) setTrees(res.data.data ?? []);
        } catch {
          // 401 do interceptor xử lý; lỗi khác → để danh sách rỗng
          if (alive) setTrees([]);
        } finally {
          if (alive) setLoading(false);
        }
      })();
      return () => {
        alive = false;
      };
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Khu rừng của bạn</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 40 }} />
      ) : trees.length === 0 ? (
        <Text style={styles.empty}>
          Chưa có cây nào. Hoàn thành một phiên tập trung để trồng cây đầu tiên! 🌱
        </Text>
      ) : (
        <FlatList
          data={trees}
          numColumns={2}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View style={[styles.treeCard, !item.isAlive && styles.treeCardDead]}>
              <Image
                source={{ uri: item.treeSpecies?.imageUrl || FALLBACK_IMG }}
                style={[styles.treeImg, !item.isAlive && styles.treeImgDead]}
              />
              <Text style={styles.treeName}>
                {item.treeSpecies?.name || "Cây bí ẩn"}
              </Text>
              <Text style={styles.treeDate}>
                Trồng ngày: {formatDate(item.plantedAt)}
              </Text>
              <Text style={styles.treeStatus}>
                {item.isAlive ? "🌳 Đang sống" : "🥀 Đã héo"}
              </Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#064e3b", padding: 15 },
  headerTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 15,
  },
  empty: {
    color: "#a7f3d0",
    fontSize: 15,
    textAlign: "center",
    marginTop: 40,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  treeCard: {
    backgroundColor: "#0a5d46",
    flex: 1,
    margin: 8,
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
  },
  treeCardDead: { backgroundColor: "#3f3f46", opacity: 0.85 },
  treeImg: { width: 70, height: 70, marginBottom: 10 },
  treeImgDead: { opacity: 0.4 },
  treeName: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  treeDate: { color: "#fff", fontSize: 12, opacity: 0.6, marginTop: 4 },
  treeStatus: { color: "#fff", fontSize: 12, marginTop: 6 },
});
