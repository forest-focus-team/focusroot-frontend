import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiClient } from "../../constants/axiosClient";

export default function GroupScreen() {
  const [members, setMembers] = useState<any[]>([]); // Sửa hoàn toàn lỗi 'never'

  useEffect(() => {
    apiClient
      .get("/group/members")
      .then((res) => setMembers(res.data))
      .catch(() =>
        setMembers([
          {
            id: "1",
            name: "Điệp (Bạn)",
            status: "Đang tập trung 🟢",
            time: "120 phút",
          },
          {
            id: "2",
            name: "Nguyễn Hùng",
            status: "Đang tập trung 🟢",
            time: "85 phút",
          },
          {
            id: "3",
            name: "Trần Minh",
            status: "Đang nghỉ ngơi 🔴",
            time: "0 phút",
          },
        ]),
      );
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Nhóm tập trung</Text>
      <FlatList
        data={members}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.memberRow}>
            <View>
              <Text style={styles.memberName}>{item.name}</Text>
              <Text style={styles.memberStatus}>{item.status}</Text>
            </View>
            <Text style={styles.memberTime}>{item.time}</Text>
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
  memberRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#0a5d46",
    padding: 18,
    borderRadius: 15,
    marginBottom: 12,
  },
  memberName: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  memberStatus: { color: "#00e676", fontSize: 13, marginTop: 4 },
  memberTime: { color: "#ffcc80", fontWeight: "bold", fontSize: 16 },
});
