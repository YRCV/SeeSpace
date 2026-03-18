import React from "react";
import { View, Image, TextInput, StyleSheet } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

interface AppHeaderProps {
    searchQuery?: string;
    onSearchChange?: (text: string) => void;
    showSearch?: boolean;
}

export function AppHeader() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.logoRow}>
                <Image
                    source={require("@/assets/images/icon.png")}
                    style={styles.logoIcon}
                    tintColor="#ffffff"
                    resizeMode="contain"
                />
                <ThemedText style={styles.logoText}>SeeSpace</ThemedText>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#2a2b2a",
        paddingTop: 3,
        paddingHorizontal: 20,
    },
    logoRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    logoIcon: {
        width: 32,
        height: 32,
    },
    logoText: {
        fontSize: 22,
        fontWeight: "700",
        color: "#ffffff",
        letterSpacing: 0.5,
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.12)",
        borderRadius: 10,
        paddingRight: 14,
        paddingLeft: 5,
        paddingVertical: 3,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.15)",
    },
    searchInput: {
        fontSize: 15,
        height: 30,
        padding: 0,
        color: "#ffffff",
    },
    searchicon: {
        paddingRight: 3,
    },
});
