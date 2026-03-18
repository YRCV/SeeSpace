import React from "react";
import {
    StyleProp,
    StyleSheet,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Fonts } from "@/constants/theme";
import { FontAwesome6 } from "@expo/vector-icons";

interface ClassroomDetailHeroProps {
    name: string;
    building: string;
    status: "free" | "occupied";
    backButtonMode?: "interactive" | "static" | "hidden";
    onBackPress?: () => void;
    style?: StyleProp<ViewStyle>;
}

export function ClassroomDetailHero({
    name,
    building,
    status,
    backButtonMode = "interactive",
    onBackPress,
    style,
}: ClassroomDetailHeroProps) {
    return (
        <View style={style}>
            {backButtonMode !== "hidden" && (
                <View style={styles.backButtonRow}>
                    {backButtonMode === "interactive" ? (
                        <TouchableOpacity
                            onPress={onBackPress}
                            activeOpacity={0.75}
                            style={styles.backButton}
                        >
                            <FontAwesome6
                                name="arrow-left"
                                size={24}
                                color="#2a2b2a"
                            />
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.backButton}>
                            <FontAwesome6
                                name="arrow-left"
                                size={24}
                                color="#000000"
                            />
                        </View>
                    )}
                </View>
            )}

            <View style={styles.roomHeader}>
                <ThemedText type="title" style={styles.roomName}>
                    {name}
                </ThemedText>
                <ThemedText style={styles.buildingName}>
                    {building}
                </ThemedText>
                <View style={styles.statusRow}>
                    <View
                        style={[
                            styles.statusIndicator,
                            {
                                backgroundColor:
                                    status === "free" ? "#4CAF50" : "#F44336",
                            },
                        ]}
                    />
                    <ThemedText style={styles.statusText}>
                        Currently {status}
                    </ThemedText>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    backButtonRow: {
        padding: 24,
        paddingTop: 60,
        paddingBottom: 0,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "flex-start",
    },
    roomHeader: {
        paddingHorizontal: 24,
        paddingBottom: 20,
         color: "#2a2b2a",
    },
    roomName: {
        fontSize: 32,
        fontFamily: Fonts.rounded,
        color: "#2a2b2a",
    },
    buildingName: {
        fontSize: 18,
        opacity: 0.6,
        marginTop: 4,
         color: "#2a2b2a",
    },
    statusRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 12,
        gap: 8,
    },
    statusIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    statusText: {
        fontSize: 14,
        fontWeight: "500",
         color: "#2a2b2a",
    },
});
