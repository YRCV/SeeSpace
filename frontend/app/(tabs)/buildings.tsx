import React, { useCallback, useMemo, useState } from "react";
import {
    StyleSheet,
    View,
    ScrollView,
    Text,
    TouchableOpacity,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

import { ClassroomCard } from "@/components/ClassroomCard";
import { BUILDINGS, Classroom, Building } from "@/constants/data";
import { useSearch } from "@/context/SearchContext";

interface BuildingAccordionProps {
    building: Building;
    isOpen: boolean;
    emptyCount: number;
    sortedRooms: Classroom[];
    onToggleBuilding: (buildingId: string) => void;
    onRoomPress: (roomId: string, transitionId: string) => void;
}

const BuildingAccordion = React.memo(function BuildingAccordion({
    building,
    isOpen,
    emptyCount,
    sortedRooms,
    onToggleBuilding,
    onRoomPress,
}: BuildingAccordionProps) {
    const contentHeight = React.useRef(0);
    const animatedHeight = useSharedValue(0);

    React.useEffect(() => {
        animatedHeight.value = withTiming(isOpen ? contentHeight.current : 0, {
            duration: 240,
            easing: Easing.out(Easing.cubic),
        });
    }, [animatedHeight, isOpen]);

    const animatedContentStyle = useAnimatedStyle(() => ({
        height: animatedHeight.value,
    }));

    return (
        <View style={styles.buildingCard}>
            {/* Building header row */}
            <TouchableOpacity
                style={[
                    styles.buildingRow,
                    !isOpen && {
                        borderBottomLeftRadius: 14,
                        borderBottomRightRadius: 14,
                    },
                ]}
                onPress={() => onToggleBuilding(building.id)}
                activeOpacity={0.75}
            >
                <View style={styles.buildingLeft}>
                    <Text
                        style={[
                            styles.chevron,
                            isOpen && styles.chevronOpen,
                        ]}
                    >
                        ›
                    </Text>
                    <Text style={styles.buildingName}>{building.name}</Text>
                </View>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{emptyCount} Empty</Text>
                </View>
            </TouchableOpacity>

            {/* Expanded room list */}
            <Animated.View
                style={[styles.roomListContainer, animatedContentStyle]}
            >
                <View
                    onLayout={(e) => {
                        const measuredHeight = e.nativeEvent.layout.height;
                        if (Math.abs(measuredHeight - contentHeight.current) < 1) {
                            return;
                        }
                        contentHeight.current = measuredHeight;
                        if (isOpen) {
                            animatedHeight.value = withTiming(measuredHeight, {
                                duration: 240,
                                easing: Easing.out(Easing.cubic),
                            });
                        }
                    }}
                    style={[styles.roomListContent, { pointerEvents: isOpen ? "auto" : "none" }]}
                >
                    {sortedRooms.map((room) => (
                        <View key={room.id} style={{ marginBottom: 10 }}>
                            <ClassroomCard
                                id={room.id}
                                name={room.name}
                                building={room.building}
                                status={room.status}
                                onPress={(transitionId) =>
                                    onRoomPress(room.id, transitionId)
                                }
                            />
                        </View>
                    ))}
                </View>
            </Animated.View>
        </View>
    );
}, (prevProps, nextProps) =>
    prevProps.isOpen === nextProps.isOpen &&
    prevProps.emptyCount === nextProps.emptyCount &&
    prevProps.building === nextProps.building &&
    prevProps.sortedRooms === nextProps.sortedRooms
);

export default function BuildingsScreen() {
    const router = useRouter();
    const { searchQuery } = useSearch();
    const [openBuildings, setOpenBuildings] = useState<Set<string>>(new Set());

    const toggleBuilding = useCallback((id: string) => {
        setOpenBuildings((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }, []);

    const sortRooms = useCallback((rooms: Classroom[]) => {
        const free = rooms
            .filter((r) => r.status === "free")
            .sort((a, b) => a.name.localeCompare(b.name));
        const occupied = rooms
            .filter((r) => r.status === "occupied")
            .sort((a, b) => a.name.localeCompare(b.name));
        return [...free, ...occupied];
    }, []);

    const onRoomPress = useCallback((roomId: string, transitionId: string) => {
        router.push({
            pathname: "/classroom/[id]",
            params: {
                id: roomId,
                ...(transitionId ? { transitionId } : {}),
            },
        });
    }, [router]);

    const filteredBuildings = useMemo(() => {
        const q = searchQuery.toLowerCase();
        return BUILDINGS.map((building) => {
            const rooms = building.rooms.filter(
                (room) =>
                    room.name.toLowerCase().includes(q) ||
                    building.name.toLowerCase().includes(q),
            );
            return {
                building,
                rooms,
                emptyCount: rooms.filter((room) => room.status === "free").length,
                sortedRooms: sortRooms(rooms),
            };
        }).filter(
            (item) =>
                item.rooms.length > 0 ||
                item.building.name.toLowerCase().includes(q),
        );
    }, [searchQuery, sortRooms]);

    return (
        <View style={styles.root}>
            <Stack.Screen options={{ headerShown: false }} />
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.list}
            >
                {filteredBuildings.map(({ building, emptyCount, sortedRooms }) => {
                    const isOpen = openBuildings.has(building.id);

                    return (
                        <BuildingAccordion
                            key={building.id}
                            building={building}
                            isOpen={isOpen}
                            emptyCount={emptyCount}
                            sortedRooms={sortedRooms}
                            onToggleBuilding={toggleBuilding}
                            onRoomPress={onRoomPress}
                        />
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#dcdcdd" },
    scroll: { flex: 1 },
    list: { padding: 16, paddingBottom: 100 },

    buildingCard: {
        backgroundColor: "#ffffff",
        borderRadius: 14,
        marginBottom: 12,
        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.08)",



        elevation: 3,
        overflow: "hidden",
    },
    buildingRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: "#2a2b2a",
    },
    buildingLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        flex: 1,
    },
    chevron: {
        fontSize: 22,
        color: "#dcdcdd",
        fontWeight: "300",
        lineHeight: 24,
        transform: [{ rotate: "0deg" }],
    },
    chevronOpen: {
        transform: [{ rotate: "90deg" }],
    },
    buildingName: {
        fontSize: 16,
        fontWeight: "700",
        color: "#ffffff",
        flexShrink: 1,
    },
    badge: {
        backgroundColor: "#d64045",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        marginLeft: 12,
    },
    badgeText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "700",
    },
    roomListContainer: {
        backgroundColor: "#f5f5f5",
        overflow: "hidden",
        position: "relative",
    },
    roomListContent: {
        padding: 12,
        gap: 0,
        backgroundColor: "#f5f5f5",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
    },
});
