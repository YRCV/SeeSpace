import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { ClassroomCardContent } from "./ClassroomCardContent";
import { useClassroomOpenTransition } from "@/context/ClassroomOpenTransitionContext";

interface ClassroomCardProps {
    id: string;
    name: string;
    building: string;
    distance?: string;
    status: "free" | "occupied";
    onPress: (transitionId: string) => void;
}

export function ClassroomCard({
    id,
    name,
    building,
    distance,
    status,
    onPress,
}: ClassroomCardProps) {
    const cardRef = React.useRef<View>(null);
    const sourceKey = React.useId();
    const { startOpenTransition, isSourceHidden, registerMeasurement, containerRef } =
        useClassroomOpenTransition();
    const hidden = isSourceHidden(sourceKey);

    React.useEffect(() => {
        return registerMeasurement(id, () => {
            return new Promise((resolve) => {
                const node = cardRef.current;
                const container = containerRef.current;

                if (!node || !container) {
                    resolve({ x: 0, y: 0, width: 0, height: 0 });
                    return;
                }

                // Use measureLayout to get position relative to container
                // This matches the overlay's positioning since overlay also uses container-relative coords via absoluteFillObject
                node.measureLayout(container, (x, y, width, height) => {
                    resolve({ x, y, width, height });
                }, () => {
                    resolve({ x: 0, y: 0, width: 0, height: 0 });
                });
            });
        });
    }, [id, registerMeasurement, containerRef]);

    const handlePress = React.useCallback(() => {
        const node = cardRef.current;
        const container = containerRef.current;

        if (!node || !container) {
            onPress("");
            return;
        }

        // Use measureLayout to get position relative to container
        // This ensures both open and close measurements use the same coordinate system
        node.measureLayout(container, (x, y, width, height) => {
            if (!width || !height) {
                onPress("");
                return;
            }

            startOpenTransition({
                room: {
                    id,
                    name,
                    building,
                    distance,
                    status,
                },
                bounds: { x, y, width, height },
                sourceKey,
                navigate: onPress,
            });
        }, () => {
            onPress("");
        });
    }, [
        building,
        containerRef,
        distance,
        id,
        name,
        onPress,
        sourceKey,
        startOpenTransition,
        status,
    ]);

    return (
        <View style={[styles.wrapper, hidden && styles.hidden]}>
            <TouchableOpacity
                onPress={handlePress}
                activeOpacity={0.75}
            >
                <View
                    ref={cardRef}
                    collapsable={false}
                    style={styles.card}
                >
                    <ClassroomCardContent
                        name={name}
                        building={building}
                        distance={distance}
                        status={status}
                    />
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        paddingHorizontal: 4,
    },
    hidden: {
        opacity: 0,
    },
    card: {
        backgroundColor: "#ffffff",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.08)",
        elevation: 3,
    },
});
