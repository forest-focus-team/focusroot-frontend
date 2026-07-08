import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#ffffff",
          height: 65,
          paddingBottom: 10,
          paddingTop: 5,
        },
        tabBarActiveTintColor: "#064e3b", // Màu xanh đậm khi chọn
        tabBarInactiveTintColor: "#888888",
      }}
    >
      {/* Tên name phải trùng chính xác với tên file .tsx trong thư mục (tabs) */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Trang chủ",
          tabBarIcon: ({ color }: { color: string }) => (
            <FontAwesome5 name="home" size={20} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="forest"
        options={{
          title: "Rừng",
          tabBarIcon: ({ color }: { color: string }) => (
            <MaterialCommunityIcons name="tree" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="group"
        options={{
          title: "Nhóm",
          tabBarIcon: ({ color }: { color: string }) => (
            <FontAwesome5 name="users" size={20} color={color} />
          ),
        }}
      />

      {/* Màn còn sót lại trong thư mục (tabs) — ẩn khỏi thanh tab, chỉ 3 tab chính hiển thị */}
      <Tabs.Screen name="detail" options={{ href: null }} />
      <Tabs.Screen name="notifications" options={{ href: null }} />
      <Tabs.Screen name="profile" options={{ href: null }} />
    </Tabs>
  );
}
