import React, { useState, useMemo } from "react";
import { StyleSheet, View, ScrollView, Pressable } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { getRoomSchedule, ScheduleEntry } from "@/constants/scheduleData";

interface ClassroomCalendarProps {
    building: string;
    roomName: string;
}

// Constants for the calendar
const START_HOUR = 6; // 6 AM
const END_HOUR = 24; // 3 AM next day (27 = 24 + 3)
const TOTAL_HOURS = END_HOUR - START_HOUR; // 21 hours
const HOUR_HEIGHT = 30; // Height per hour in pixels
const TOTAL_HEIGHT = TOTAL_HOURS * HOUR_HEIGHT;

interface CalendarBlock {
    id: string;
    type: "occupied" | "free";
    title?: string;
    startMinutes: number; // Minutes from START_HOUR
    durationMinutes: number;
    entry?: ScheduleEntry;
}

function processScheduleForDay(
    dayDate: Date,
    schedule: ScheduleEntry[],
): CalendarBlock[] {
    // Define the time window for this day (6 AM to 3 AM next day)
    const dayStart = new Date(dayDate);
    dayStart.setHours(START_HOUR, 0, 0, 0);

    const dayEnd = new Date(dayDate);
    dayEnd.setDate(dayEnd.getDate() + 1);
    dayEnd.setHours(END_HOUR - 24, 0, 0, 0);

    // Filter events that overlap with this day window
    const dayEvents = schedule.filter((entry) => {
        const entryStart = new Date(entry.startTime);
        const entryEnd = new Date(entry.endTime);
        return entryStart < dayEnd && entryEnd > dayStart;
    });

    // Sort events by start time
    dayEvents.sort(
        (a, b) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    );

    const blocks: CalendarBlock[] = [];
    let currentTime = new Date(dayStart);

    // Merge adjacent events with same title
    const mergedEvents: ScheduleEntry[] = [];
    for (const event of dayEvents) {
        const eventStart = new Date(event.startTime);
        const eventEnd = new Date(event.endTime);

        // Clamp to day bounds
        const clampedStart = new Date(
            Math.max(eventStart.getTime(), dayStart.getTime()),
        );
        const clampedEnd = new Date(
            Math.min(eventEnd.getTime(), dayEnd.getTime()),
        );

        if (mergedEvents.length > 0) {
            const lastEvent = mergedEvents[mergedEvents.length - 1];
            const lastEnd = new Date(lastEvent.endTime);

            // Check if same title and adjacent (within 1 minute)
            if (
                lastEvent.title === event.title &&
                Math.abs(lastEnd.getTime() - clampedStart.getTime()) < 60000
            ) {
                // Extend the last event
                lastEvent.endTime = event.endTime;
                continue;
            }
        }

        mergedEvents.push({
            ...event,
            startTime: clampedStart.toISOString(),
            endTime: clampedEnd.toISOString(),
        });
    }

    // Create blocks (both free and occupied)
    for (const event of mergedEvents) {
        const eventStart = new Date(event.startTime);
        const eventEnd = new Date(event.endTime);

        // Calculate minutes from START_HOUR
        const eventStartMinutes =
            (eventStart.getTime() - dayStart.getTime()) / 1000 / 60;
        const eventEndMinutes =
            (eventEnd.getTime() - dayStart.getTime()) / 1000 / 60;

        // Fill free gap before this event
        const gapMinutes =
            eventStartMinutes -
            (currentTime.getTime() - dayStart.getTime()) / 1000 / 60;
        if (gapMinutes > 0) {
            blocks.push({
                id: `free-${currentTime.getTime()}`,
                type: "free",
                startMinutes:
                    (currentTime.getTime() - dayStart.getTime()) / 1000 / 60,
                durationMinutes: gapMinutes,
            });
        }

        // Add occupied block
        const duration = eventEndMinutes - eventStartMinutes;
        blocks.push({
            id: `event-${event.title}-${eventStart.getTime()}`,
            type: "occupied",
            title: event.title,
            startMinutes: eventStartMinutes,
            durationMinutes: duration,
            entry: event,
        });

        currentTime = new Date(eventEnd);
    }

    // Fill remaining free time until dayEnd
    const remainingMinutes =
        (dayEnd.getTime() - currentTime.getTime()) / 1000 / 60;
    if (remainingMinutes > 0) {
        blocks.push({
            id: `free-end-${dayDate.getTime()}`,
            type: "free",
            startMinutes:
                (currentTime.getTime() - dayStart.getTime()) / 1000 / 60,
            durationMinutes: remainingMinutes,
        });
    }

    // If no events at all, mark entire day as free
    if (blocks.length === 0) {
        blocks.push({
            id: `free-all-${dayDate.getTime()}`,
            type: "free",
            startMinutes: 0,
            durationMinutes: TOTAL_HOURS * 60,
        });
    }

    return blocks;
}

export function ClassroomCalendar({
    building,
    roomName,
}: ClassroomCalendarProps) {
    const [selectedEvent, setSelectedEvent] = useState<ScheduleEntry | null>(
        null,
    );
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

    // Use March 18, 2026 as anchor date (Wednesday)
    const today = new Date("2026-03-18T12:00:00-04:00");
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    // Get room schedule
    const schedule = getRoomSchedule(building, roomName);

    // Generate time labels (06:00 to 03:00)
    const timeLabels = useMemo(() => {
        const labels: string[] = [];
        for (let hour = START_HOUR; hour <= END_HOUR; hour++) {
            const displayHour = hour >= 24 ? hour - 24 : hour;
            const period = hour >= 12 && hour < 24 ? "PM" : "AM";
            const formattedHour =
                displayHour === 0
                    ? 12
                    : displayHour > 12
                      ? displayHour - 12
                      : displayHour;
            labels.push(`${formattedHour}:00 ${period}`);
        }
        return labels;
    }, []);

    // Get the date for a specific day index (relative to anchor)
    const getDayDate = (weekOffset: number, dayIndex: number): Date => {
        const startOfWeek1 = new Date(today);
        startOfWeek1.setDate(today.getDate() - today.getDay() + 1); // Monday of current week

        const dayDate = new Date(startOfWeek1);
        dayDate.setDate(startOfWeek1.getDate() + weekOffset * 7 + dayIndex);
        return dayDate;
    };

    const handleBlockPress = (block: CalendarBlock) => {
        if (block.type === "occupied" && block.entry) {
            if (selectedBlockId === block.id) {
                setSelectedBlockId(null);
                setSelectedEvent(null);
            } else {
                setSelectedBlockId(block.id);
                setSelectedEvent(block.entry);
            }
        } else {
            setSelectedBlockId(null);
            setSelectedEvent(null);
        }
    };

    return (
        <Pressable
            style={styles.calendarContainer}
            onPress={() => {
                setSelectedBlockId(null);
                setSelectedEvent(null);
            }}
        >
            <ThemedText type="defaultSemiBold" style={styles.calendarTitle}>
                2-Week Availability
            </ThemedText>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.weeksContainer}>
                    {[0, 1].map((week) => (
                        <View key={`week-${week}`} style={styles.week}>
                            <ThemedText style={styles.weekLabel}>
                                {week === 0 ? "Current Week" : "Next Week"}
                            </ThemedText>
                            <View style={styles.grid}>
                                {/* Time column */}
                                <View style={styles.timeColumn}>
                                    {timeLabels.map((label, index) => (
                                        <ThemedText
                                            key={`time-${index}`}
                                            style={[styles.timeLabel]}
                                        >
                                            {label}
                                        </ThemedText>
                                    ))}
                                </View>

                                {/* Day columns */}
                                {days.map((day, dayIndex) => {
                                    const dayDate = getDayDate(week, dayIndex);
                                    const blocks = processScheduleForDay(
                                        dayDate,
                                        schedule,
                                    );

                                    return (
                                        <View
                                            key={day}
                                            style={styles.dayColumn}
                                        >
                                            <ThemedText style={styles.dayLabel}>
                                                {day}
                                            </ThemedText>
                                            <View style={styles.dayContent}>
                                                {blocks.map((block) => {
                                                    const top =
                                                        (block.startMinutes /
                                                            60) *
                                                        HOUR_HEIGHT;
                                                    const height =
                                                        (block.durationMinutes /
                                                            60) *
                                                        HOUR_HEIGHT;
                                                    const isSelected =
                                                        selectedBlockId ===
                                                        block.id;

                                                    return (
                                                        <Pressable
                                                            key={block.id}
                                                            onPress={(e) => {
                                                                e.stopPropagation();
                                                                handleBlockPress(
                                                                    block,
                                                                );
                                                            }}
                                                            style={[
                                                                styles.block,
                                                                {
                                                                    top,
                                                                    height: Math.max(
                                                                        height,
                                                                        4,
                                                                    ), // Minimum 4px height
                                                                    backgroundColor:
                                                                        block.type ===
                                                                        "occupied"
                                                                            ? "rgba(244, 67, 54, 0.2)"
                                                                            : "rgba(76, 175, 80, 0.2)",
                                                                    borderColor:
                                                                        block.type ===
                                                                        "occupied"
                                                                            ? "#F44336"
                                                                            : "#4CAF50",
                                                                },
                                                                isSelected &&
                                                                    styles.blockSelected,
                                                            ]}
                                                        />
                                                    );
                                                })}
                                                {/* Hour markers */}
                                                {Array.from({ length: TOTAL_HOURS + 1 }, (_, i) => (
                                                    <View
                                                        key={`marker-${i}`}
                                                        style={[
                                                            styles.hourMarker,
                                                            { top: i * HOUR_HEIGHT },
                                                        ]}
                                                    />
                                                ))}
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>

            <View style={styles.bottomRow}>
                <View style={styles.legend}>
                    <View style={styles.legendItem}>
                        <View
                            style={[
                                styles.blockIndicator,
                                {
                                    backgroundColor: "rgba(76, 175, 80, 0.2)",
                                    borderColor: "#4CAF50",
                                },
                            ]}
                        />
                        <ThemedText style={styles.legendText}>Free</ThemedText>
                    </View>
                    <View style={styles.legendItem}>
                        <View
                            style={[
                                styles.blockIndicator,
                                {
                                    backgroundColor: "rgba(244, 67, 54, 0.2)",
                                    borderColor: "#F44336",
                                },
                            ]}
                        />
                        <ThemedText style={styles.legendText}>
                            Occupied
                        </ThemedText>
                    </View>
                </View>

                {selectedEvent && (
                    <View style={styles.infoBox}>
                        <View style={styles.infoBoxHeader}>
                            <View style={styles.infoBoxDot} />
                            <ThemedText
                                style={styles.infoBoxTitle}
                                numberOfLines={1}
                            >
                                {selectedEvent.title}
                            </ThemedText>
                        </View>
                        <ThemedText style={styles.infoBoxTime}>
                            {new Date(
                                selectedEvent.startTime,
                            ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                            {" - "}
                            {new Date(selectedEvent.endTime).toLocaleTimeString(
                                [],
                                { hour: "2-digit", minute: "2-digit" },
                            )}
                        </ThemedText>
                    </View>
                )}
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    calendarContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    calendarTitle: {
        fontSize: 20,
        marginBottom: 10,
        color: "#2a2b2a",
    },
    weeksContainer: {
        flexDirection: "row",
        gap: 20,
    },
    week: {
        width: 360,
    },
    weekLabel: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#d64045",
    },
    grid: {
        flexDirection: "row",
        gap: 10,
    },
    timeColumn: {
        paddingTop: 13,
        width: 50,
        height: TOTAL_HEIGHT,
    },
    timeLabel: {
        height: HOUR_HEIGHT-0.1,
        fontSize: 10,
        textAlign: "right",
        paddingRight: 4,
        opacity: 0.5,
        color: "#2a2b2a",
    },
    midnightLabel: {
        fontWeight: "bold",
        opacity: 0.8,
    },
    dayColumn: {
        flex: 1,
    },
    dayLabel: {
        textAlign: "center",
        fontSize: 12,
        fontWeight: "bold",
        marginBottom: 4,
        color: "#2a2b2a",
    },
    dayContent: {
        position: "relative",
        height: TOTAL_HEIGHT,
    },
    hourMarker: {
        position: "absolute",
        left: "50%",
        marginLeft: -10,
        width: 20,
        height: 1,
        backgroundColor: "rgba(0, 0, 0, 0.15)",
    },
    block: {
        position: "absolute",
        left: 0,
        right: 0,
        borderRadius: 2,
        borderWidth: 1,
    },
    blockSelected: {
        borderWidth: 2,
        zIndex: 10,
    },
    bottomRow: {
        flexDirection: "row",
        marginTop: 16,
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    legend: {
        flexDirection: "column",
        gap: 12,
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
    blockIndicator: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 1,
    },
    infoBox: {
        backgroundColor: "#2a2b2a",
        padding: 12,
        borderRadius: 12,
        width: 200,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    infoBoxHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 4,
    },
    infoBoxDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#F44336",
    },
    infoBoxTitle: {
        color: "#ffffff",
        fontSize: 12,
        fontWeight: "bold",
        flex: 1,
    },
    infoBoxTime: {
        color: "rgba(255, 255, 255, 0.7)",
        fontSize: 10,
        marginLeft: 16,
    },
});
