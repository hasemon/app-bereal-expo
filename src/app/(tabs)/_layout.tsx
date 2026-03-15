import {Tabs} from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React from "react";

// Helper to reduce repetition in tab icon rendering
const renderTabBarIcon = (focusedName: keyof typeof Ionicons.glyphMap, outlineName: keyof typeof Ionicons.glyphMap) =>
  ({ color, size, focused }: { color: string; size: number; focused: boolean }) => (
    <Ionicons
      name={focused ? focusedName : outlineName}
      size={size}
      color={color}
    />
  );

export default function TabLayout() {
  return <Tabs screenOptions={{ tabBarActiveTintColor: "crimson" }}>
    <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: renderTabBarIcon("home", "home-outline"),
        }}
    />
    <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: renderTabBarIcon("person", "person-outline"),
        }}
    />
    <Tabs.Screen
        name="about"
        options={{
          title: "About",
          tabBarIcon: renderTabBarIcon("information-circle", "information-circle-outline"),
        }}
    />
  </Tabs>;
}
