import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

import { IconSymbol } from "./ui/icon-symbol";

interface ClassroomCardContentProps {
    name: string;
    building: string;
    distance?: string;
    status: "free" | "occupied";
    style?: StyleProp<ViewStyle>;
    hideChevron?: boolean;
}

export function ClassroomCardContent({
    name,
    building,
    distance,
    status,
    style,
    hideChevron = false,
}: ClassroomCardContentProps) {
    return (
        <View style={[styles.content, style]}>
            <View style={styles.left}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.building}>{building}</Text>
                {distance && (
                    <Text style={styles.distance}>{distance}</Text>
                )}
            </View>
            <View style={styles.right}>
                <View
                    style={[
                        styles.dot,
                        {
                            backgroundColor:
                                status === "free" ? "#4CAF50" : "#F44336",
                        },
                    ]}
                />
                {!hideChevron && (
                    <IconSymbol
                        name="chevron.right"
                        size={18}
                        color="#2a2b2a"
                        style={{ opacity: 0.3 }}
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    content: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    left: { flex: 1 },
    name: { fontSize: 16, fontWeight: "600", color: "#2a2b2a" },
    building: { fontSize: 13, color: "#2a2b2a", opacity: 0.55, marginTop: 2 },
    distance: {
        fontSize: 12,
        color: "#d64045",
        marginTop: 4,
        fontWeight: "500",
    },
    right: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginLeft: 12,
    },
    dot: { width: 12, height: 12, borderRadius: 6 },
});
