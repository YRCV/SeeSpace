import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { ThemedText } from "@/components/themed-text";

export function ClassroomCalendar() {
    // Mock data for 2-week calendar
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    const blocks = [
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
    ];

    const isBlockFree = (day: string, time: string) => {
        // Random mock logic for availability
        return (day.length + time.length) % 3 === 0;
    };

    return (
        <View style={styles.calendarContainer}>
            <ThemedText type="defaultSemiBold" style={styles.calendarTitle}>
                2-Week Availability
            </ThemedText>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.weeksContainer}>
                    {[0, 1].map((week) => (
                        <View key={`week-${week}`} style={styles.week}>
                            <ThemedText style={styles.weekLabel}>
                                Week {week + 1}
                            </ThemedText>
                            <View style={styles.grid}>
                                <View style={styles.timeColumn}>
                                    {blocks.map((block) => (
                                        <ThemedText
                                            key={block}
                                            style={styles.timeLabel}
                                        >
                                            {block}
                                        </ThemedText>
                                    ))}
                                </View>
                                {days.map((day) => (
                                    <View key={day} style={styles.dayColumn}>
                                        <ThemedText style={styles.dayLabel}>
                                            {day}
                                        </ThemedText>
                                        {blocks.map((block) => {
                                            const free = isBlockFree(
                                                day + week,
                                                block,
                                            );
                                            return (
                                                <View
                                                    key={`${day}-${block}`}
                                                    style={[
                                                        styles.block,
                                                        {
                                                            backgroundColor:
                                                                free
                                                                    ? "rgba(76, 175, 80, 0.2)"
                                                                    : "rgba(244, 67, 54, 0.2)",
                                                        },
                                                        {
                                                            borderColor: free
                                                                ? "#4CAF50"
                                                                : "#F44336",
                                                        },
                                                    ]}
                                                />
                                            );
                                        })}
                                    </View>
                                ))}
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
            <View style={styles.legend}>
                <View style={styles.legendItem}>
                    <View
                        style={[
                            styles.block,
                            {
                                backgroundColor: "rgba(76, 175, 80, 0.2)",
                                borderColor: "#4CAF50",
                                width: 20,
                                height: 20,
                            },
                        ]}
                    />
                    <ThemedText style={styles.legendText}>Free</ThemedText>
                </View>
                <View style={styles.legendItem}>
                    <View
                        style={[
                            styles.block,
                            {
                                backgroundColor: "rgba(244, 67, 54, 0.2)",
                                borderColor: "#F44336",
                                width: 20,
                                height: 20,
                            },
                        ]}
                    />
                    <ThemedText style={styles.legendText}>Occupied</ThemedText>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    calendarContainer: {
        padding: 20,
    },
    calendarTitle: {
        fontSize: 20,
        marginBottom: 20,
        color: "#2a2b2a",
    },
    weeksContainer: {
        flexDirection: "row",
        gap: 40,
    },
    week: {
        width: 320,
    },
    weekLabel: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 12,
        color: "#d64045",
    },
    grid: {
        flexDirection: "row",
        gap: 4,
    },
    timeColumn: {
        marginTop: 24,
        gap: 4,
    },
    timeLabel: {
        height: 30,
        fontSize: 10,
        textAlign: "right",
        paddingRight: 4,
        opacity: 0.5,
        color: "#2a2b2a",
    },
    dayColumn: {
        flex: 1,
        gap: 4,
    },
    dayLabel: {
        textAlign: "center",
        fontSize: 12,
        fontWeight: "bold",
        marginBottom: 4,
        color: "#2a2b2a",
    },
    block: {
        height: 30,
        borderRadius: 4,
        borderWidth: 1,
    },
    legend: {
        flexDirection: "row",
        marginTop: 24,
        gap: 20,
        justifyContent: "center",
    },
    legendItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    legendText: {
        fontSize: 14,
        color: "#2a2b2a",
    },
});
