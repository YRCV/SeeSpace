import React from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming,
} from "react-native-reanimated";

import { ClassroomCardContent } from "@/components/ClassroomCardContent";
import { ClassroomDetailHero } from "@/components/ClassroomDetailHero";
import { ClassroomCalendar } from "@/components/ClassroomCalendar";

interface TransitionRoom {
    id: string;
    name: string;
    building: string;
    distance?: string;
    status: "free" | "occupied";
}

interface TransitionBounds {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface TransitionPayload {
    room: TransitionRoom;
    bounds: TransitionBounds;
    sourceKey: string;
    navigate: (transitionId: string) => void;
}

interface TransitionState {
    room: TransitionRoom;
    bounds: TransitionBounds;
    sourceKey: string;
    transitionId: string;
    phase: "expanding" | "waiting_for_destination" | "settling" | "closing";
}

interface ClassroomOpenTransitionContextValue {
    startOpenTransition: (payload: TransitionPayload) => void;
    startCloseTransition: (roomId: string, navigateBack: () => void) => void;
    registerMeasurement: (
        roomId: string,
        measure: () => Promise<TransitionBounds>,
    ) => () => void;
    completeOpenTransition: () => void;
    isSourceHidden: (sourceKey: string) => boolean;
}

const ClassroomOpenTransitionContext =
    React.createContext<ClassroomOpenTransitionContextValue | null>(null);

function ClassroomOpenTransitionOverlay({
    transition,
    onExpanded,
    onSettled,
}: {
    transition: TransitionState | null;
    onExpanded: () => void;
    onSettled: () => void;
}) {
    const { width: screenWidth, height: screenHeight } = useWindowDimensions();

    // Use a ref instead of useState for the snapshot.
    // Previously, snapshot was state updated inside useEffect, which caused:
    //   render 1: transition arrives → snapshot still null → overlay returns null (invisible!)
    //   useEffect: setSnapshot(transition) → triggers render 2
    //   render 2: snapshot set → heavy components mount → another useEffect starts animation
    // That's 2 full render cycles + 2 post-paint effect delays before animation starts.
    //
    // With a ref, we update synchronously during render so the overlay
    // mounts its content on the very first pass.
    const snapshotRef = React.useRef<TransitionState | null>(null);
    if (transition) {
        snapshotRef.current = transition;
    } else {
        snapshotRef.current = null;
    }
    const snapshot = snapshotRef.current;

    const overlayOpacity = useSharedValue(0);
    const surfaceX = useSharedValue(0);
    const surfaceY = useSharedValue(0);
    const surfaceWidth = useSharedValue(0);
    const surfaceHeight = useSharedValue(0);
    const surfaceRadius = useSharedValue(12);
    const surfaceShadow = useSharedValue(0.08);
    const surfaceElevation = useSharedValue(3);
    const previewOpacity = useSharedValue(1);
    const detailOpacity = useSharedValue(0);
    const detailTranslateY = useSharedValue(18);

    // useLayoutEffect instead of useEffect: starts the animation BEFORE the
    // browser paints, shaving off one frame of dead time (~16ms+).
    React.useLayoutEffect(() => {
        if (!transition || transition.phase !== "expanding") {
            return;
        }

        overlayOpacity.value = 1;
        previewOpacity.value = 1;
        surfaceX.value = transition.bounds.x;
        surfaceY.value = transition.bounds.y;
        surfaceWidth.value = transition.bounds.width;
        surfaceHeight.value = transition.bounds.height;
        surfaceRadius.value = 12;
        surfaceShadow.value = 0.08;
        surfaceElevation.value = 3;
        detailOpacity.value = 0;
        detailTranslateY.value = 18;

        const expandConfig = {
            duration: 200,
            easing: Easing.bezier(0.2, 0.07, 0, 0.99),
        };

        surfaceX.value = withTiming(0, expandConfig);
        surfaceY.value = withTiming(0, expandConfig);
        surfaceWidth.value = withTiming(screenWidth, expandConfig);
        surfaceRadius.value = withTiming(0, {
            duration: 300,
            easing: Easing.out(Easing.cubic),
        });
        surfaceShadow.value = withTiming(0, expandConfig);
        surfaceElevation.value = withTiming(0, expandConfig);
        previewOpacity.value = withTiming(0, {
            duration: 180,
            easing: Easing.out(Easing.quad),
        });
        detailOpacity.value = withDelay(
            90,
            withTiming(1, {
                duration: 210,
                easing: Easing.out(Easing.cubic),
            }),
        );
        detailTranslateY.value = withDelay(
            90,
            withTiming(0, {
                duration: 240,
                easing: Easing.out(Easing.cubic),
            }),
        );
        surfaceHeight.value = withTiming(
            screenHeight,
            expandConfig,
            (finished) => {
                if (finished) {
                    runOnJS(onExpanded)();
                }
            },
        );
    }, [
        onExpanded,
        overlayOpacity,
        previewOpacity,
        screenHeight,
        screenWidth,
        detailOpacity,
        detailTranslateY,
        surfaceHeight,
        surfaceRadius,
        surfaceShadow,
        surfaceElevation,
        surfaceWidth,
        surfaceX,
        surfaceY,
        transition,
    ]);

    React.useLayoutEffect(() => {
        if (!transition || transition.phase !== "settling") {
            return;
        }

        overlayOpacity.value = withTiming(
            0,
            {
                duration: 0,
                easing: Easing.out(Easing.cubic),
            },
            (finished) => {
                if (finished) {
                    runOnJS(onSettled)();
                }
            },
        );
    }, [onSettled, overlayOpacity, transition]);

    const overlayStyle = useAnimatedStyle(() => ({
        opacity: overlayOpacity.value,
    }));

    const surfaceStyle = useAnimatedStyle(() => ({
        left: surfaceX.value,
        top: surfaceY.value,
        width: surfaceWidth.value,
        height: surfaceHeight.value,
        borderRadius: surfaceRadius.value,
        boxShadow: `0px 1px 3px rgba(0, 0, 0, ${Math.max(0, surfaceShadow.value).toFixed(3)})`,
        elevation: surfaceElevation.value,
    }));

    const previewStyle = useAnimatedStyle(() => ({
        opacity: previewOpacity.value,
    }));

    const detailStyle = useAnimatedStyle(() => ({
        opacity: detailOpacity.value,
        transform: [{ translateY: detailTranslateY.value }],
    }));

    const maskStyle = useAnimatedStyle(() => ({
        width: "100%",
        height: "100%",
        borderRadius: surfaceRadius.value,
        overflow: "hidden",
    }));

    if (!snapshot) {
        return null;
    }

    return (
        <View
            style={[
                styles.overlayBlocker,
                {
                    pointerEvents:
                        snapshot.phase === "settling" ? "none" : "auto",
                },
            ]}
        >
            <Animated.View style={[styles.overlay, overlayStyle]}>
                <Animated.View style={[styles.transitionSurface, surfaceStyle]}>
                    <Animated.View style={maskStyle}>
                        <Animated.View
                            style={[
                                styles.transitionPreview,
                                { height: snapshot.bounds.height },
                                previewStyle,
                            ]}
                        >
                            <ClassroomCardContent
                                name={snapshot.room.name}
                                building={snapshot.room.building}
                                distance={snapshot.room.distance}
                                status={snapshot.room.status}
                            />
                        </Animated.View>
                        <Animated.View
                            style={[
                                styles.transitionDetailLayer,
                                detailStyle,
                                { pointerEvents: "none" },
                            ]}
                        >
                            <ClassroomDetailHero
                                name={snapshot.room.name}
                                building={snapshot.room.building}
                                status={snapshot.room.status}
                                backButtonMode="static"
                            />
                            <ClassroomCalendar
                                building={snapshot.room.building}
                                roomName={snapshot.room.name}
                            />
                        </Animated.View>
                    </Animated.View>
                </Animated.View>
            </Animated.View>
        </View>
    );
}

export function ClassroomOpenTransitionProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [transition, setTransition] = React.useState<TransitionState | null>(
        null,
    );
    const containerRef = React.useRef<View>(null);
    const pendingNavigationRef = React.useRef<{
        navigate: (transitionId: string) => void;
        transitionId: string;
    } | null>(null);
    const lastOpenedStateRef = React.useRef<{
        [roomId: string]: {
            room: TransitionRoom;
            bounds: TransitionBounds;
            sourceKey: string;
        };
    }>({});
    const measurementRegistryRef = React.useRef<{
        [roomId: string]: () => Promise<TransitionBounds>;
    }>({});
    const transitionCounterRef = React.useRef(0);
    const fallbackTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
        null,
    );

    const clearFallbackTimer = React.useCallback(() => {
        if (fallbackTimerRef.current) {
            clearTimeout(fallbackTimerRef.current);
            fallbackTimerRef.current = null;
        }
    }, []);

    React.useEffect(() => clearFallbackTimer, [clearFallbackTimer]);

    const createTransitionId = React.useCallback(() => {
        transitionCounterRef.current += 1;
        return `classroom-open-${transitionCounterRef.current}`;
    }, []);

    const startOpenTransition = React.useCallback(
        (payload: TransitionPayload) => {
            clearFallbackTimer();

            const transitionId = createTransitionId();
            if (transition) {
                payload.navigate(transitionId);
                return;
            }

            pendingNavigationRef.current = {
                navigate: payload.navigate,
                transitionId,
            };
            lastOpenedStateRef.current[payload.room.id] = {
                room: payload.room,
                bounds: payload.bounds,
                sourceKey: payload.sourceKey,
            };
            setTransition({
                room: payload.room,
                bounds: payload.bounds,
                sourceKey: payload.sourceKey,
                transitionId,
                phase: "expanding",
            });
        },
        [clearFallbackTimer, createTransitionId, transition],
    );

    const handleExpanded = React.useCallback(() => {
        const pending = pendingNavigationRef.current;
        pendingNavigationRef.current = null;

        if (!pending) {
            return;
        }

        // PRE-EMPTIVE: Set the fallback timer BEFORE navigation.
        // If navigate() mounts the screen synchronously (common in some router versions),
        // completeOpenTransition will fire and correctly clear this timer.
        // If we set it after navigate(), it might stay running even if completeOpenTransition ran!
        clearFallbackTimer();
        fallbackTimerRef.current = setTimeout(() => {
            setTransition((current) => {
                if (!current || current.transitionId !== pending.transitionId) {
                    return current;
                }

                return {
                    ...current,
                    phase: "settling",
                };
            });
            fallbackTimerRef.current = null;
        }, 1000);

        setTransition((current) => {
            if (!current || current.transitionId !== pending.transitionId) {
                return current;
            }

            return {
                ...current,
                phase: "waiting_for_destination",
            };
        });
        pending.navigate(pending.transitionId);
    }, [clearFallbackTimer]);

    const completeOpenTransition = React.useCallback(() => {
        clearFallbackTimer();
        setTransition((current) => {
            if (!current) {
                return current;
            }

            if (current.phase === "settling" || current.phase === "closing") {
                return current;
            }

            return {
                ...current,
                phase: "settling",
            };
        });
    }, [clearFallbackTimer]);

    const registerMeasurement = React.useCallback(
        (roomId: string, measure: () => Promise<TransitionBounds>) => {
            measurementRegistryRef.current[roomId] = measure;
            return () => {
                if (measurementRegistryRef.current[roomId] === measure) {
                    delete measurementRegistryRef.current[roomId];
                }
            };
        },
        [],
    );

    const startCloseTransition = React.useCallback(
        async (roomId: string, navigateBack: () => void) => {
            clearFallbackTimer();

            // Clear any existing transition immediately (no closing animation)
            setTransition(null);
            pendingNavigationRef.current = null;

            // Navigate back immediately without animation
            navigateBack();
        },
        [clearFallbackTimer],
    );

    const handleSettled = React.useCallback(() => {
        clearFallbackTimer();
        pendingNavigationRef.current = null;
        setTransition(null);
    }, [clearFallbackTimer]);

    const isSourceHidden = React.useCallback(
        (sourceKey: string) => transition?.sourceKey === sourceKey,
        [transition],
    );

    const value = React.useMemo(
        () => ({
            startOpenTransition,
            startCloseTransition,
            registerMeasurement,
            completeOpenTransition,
            isSourceHidden,
        }),
        [
            completeOpenTransition,
            isSourceHidden,
            registerMeasurement,
            startCloseTransition,
            startOpenTransition,
        ],
    );

    return (
        <ClassroomOpenTransitionContext.Provider value={value}>
            <View
                ref={containerRef}
                style={styles.providerContainer}
                collapsable={false}
            >
                {children}
            </View>
            <ClassroomOpenTransitionOverlay
                transition={transition}
                onExpanded={handleExpanded}
                onSettled={handleSettled}
            />
        </ClassroomOpenTransitionContext.Provider>
    );
}

export function useClassroomOpenTransition() {
    const context = React.useContext(ClassroomOpenTransitionContext);

    if (!context) {
        throw new Error(
            "useClassroomOpenTransition must be used within ClassroomOpenTransitionProvider",
        );
    }

    return context;
}

const styles = StyleSheet.create({
    overlayBlocker: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 999,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
    },
    transitionSurface: {
        position: "absolute",
        backgroundColor: "#ffffff",
        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.08)",
    },
    transitionPreview: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "#ffffff",
        overflow: "hidden",
    },
    transitionDetailLayer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "#ffffff",
    },
    providerContainer: {
        flex: 1,
    },
});
