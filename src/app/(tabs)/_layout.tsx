import {Ionicons} from "@expo/vector-icons";
import React from "react";
import {NativeTabs} from "expo-router/unstable-native-tabs";

// Helper to reduce repetition in tab icon rendering
const renderTabBarIcon = (focusedName: keyof typeof Ionicons.glyphMap, outlineName: keyof typeof Ionicons.glyphMap) =>
    ({color, size, focused}: { color: string; size: number; focused: boolean }) => (
        <Ionicons
            name={focused ? focusedName : outlineName}
            size={size}
            color={color}
        />
    );

export default function TabLayout() {
    return <NativeTabs

    >
        <NativeTabs.Trigger
            name="index"
        >
            <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
            <NativeTabs.Trigger.Icon sf={{default: 'house', selected: 'house.fill'}} md="home"/>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger
            name="profile"
        >
            <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
            <NativeTabs.Trigger.Icon sf={{default: 'person', selected: 'person.fill'}} md="person"/>
        </NativeTabs.Trigger>
    </NativeTabs>;
}
