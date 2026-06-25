import React, { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // Hết bị gạch chữ
import { apiClient } from "../../constants/axiosClient";

export default function ForestScreen() {
  const [trees, setTrees] = useState<any[]>([]); // Sửa hoàn toàn lỗi 'never'

  useEffect(() => {
    apiClient
      .get("/forest/trees")
      .then((res) => setTrees(res.data))
      .catch(() =>
        setTrees([
          {
            id: "1",
            name: "Cây Sồi",
            date: "20/10",
            img: "https://cdn-icons-png.flaticon.com/512/490/490154.png",
          },
          {
            id: "2",
            name: "Cây Thông",
            date: "21/10",
            img: "https://cdn-icons-png.flaticon.com/512/490/490161.png",
          },
          {
            id: "3",
            name: "Cây Bạch Dương",
            date: "22/10",
            img: "https://cdn-icons-png.flaticon.com/512/490/490154.png",
          },
          {
            id: "4",
            name: "Cây Đào",
            date: "23/10",
            img: "https://cdn-icons-png.flaticon.com/512/490/490161.png",
          },
        ]),
      );
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Khu rừng của bạn</Text>
      <FlatList
        data={trees}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.treeCard}>
            <Image source={{ uri: item.img }} style={styles.treeImg} />
            <Text style={styles.treeName}>{item.name}</Text>
            <Text style={styles.treeDate}>Ngày trồng: {item.date}</Text>
          </View>
        )}
      />
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
  treeCard: {
    backgroundColor: "#0a5d46",
    flex: 1,
    margin: 8,
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
  },
  treeImg: { width: 70, height: 70, marginBottom: 10 },
  treeName: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  treeDate: { color: "#fff", fontSize: 12, opacity: 0.6, marginTop: 4 },
});
