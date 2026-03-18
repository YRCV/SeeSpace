import React, { useEffect, useRef } from "react";
import {
    View,
    TextInput,
    StyleSheet,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    Animated,
    Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const COLLAPSED_WIDTH = width * 0.5;
const EXPANDED_WIDTH = width * 0.75;

interface FloatingSearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    visible?: boolean;
}

export function FloatingSearchBar({
    value,
    onChangeText,
    placeholder = "Search...",
    visible = true,
}: FloatingSearchBarProps) {
    const animatedWidth = useRef(
        new Animated.Value(visible ? COLLAPSED_WIDTH : 42),
    ).current;
    const animatedScale = useRef(new Animated.Value(visible ? 1 : 0)).current;
    const isKeyboardVisible = useRef(false);

    useEffect(() => {
        if (visible) {
            Animated.sequence([
                Animated.timing(animatedScale, {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: false,
                }),
                Animated.spring(animatedWidth, {
                    toValue: isKeyboardVisible.current
                        ? EXPANDED_WIDTH
                        : COLLAPSED_WIDTH,
                    useNativeDriver: false,
                    friction: 8,
                    tension: 50,
                }),
            ]).start();
        } else {
            Animated.sequence([
                Animated.timing(animatedWidth, {
                    toValue: 42,
                    duration: 200,
                    useNativeDriver: false,
                }),
                Animated.timing(animatedScale, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: false,
                }),
            ]).start();
        }
    }, [visible, animatedWidth, animatedScale]);

    useEffect(() => {
        const showEvent =
            Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
        const hideEvent =
            Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

        const showSub = Keyboard.addListener(showEvent, () => {
            isKeyboardVisible.current = true;
            if (visible) {
                Animated.spring(animatedWidth, {
                    toValue: EXPANDED_WIDTH,
                    useNativeDriver: false, // width animation does not support native driver
                    friction: 8,
                    tension: 50,
                }).start();
            }
        });

        const hideSub = Keyboard.addListener(hideEvent, () => {
            isKeyboardVisible.current = false;
            if (visible) {
                Animated.spring(animatedWidth, {
                    toValue: COLLAPSED_WIDTH,
                    useNativeDriver: false,
                    friction: 8,
                    tension: 50,
                }).start();
            }
        });

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, [animatedWidth, visible]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={[styles.keyboardWrapper, { pointerEvents: "none" }]} //keybord avoiding view is preventing clicks to the classroomcard and buildingsaccordion in website
            keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0} // Offset for bottom tab bar
        >
            <View
                style={[
                    styles.container,
                    { pointerEvents: visible ? "box-none" : "none" },
                ]}
            >
                <Animated.View
                    style={[
                        styles.searchBar,
                        {
                            width: animatedWidth,
                            transform: [{ scale: animatedScale }],
                            opacity: animatedScale.interpolate({
                                inputRange: [0, 0.5, 1],
                                outputRange: [0, 1, 1],
                            }),
                        },
                    ]}
                >
                    <View style={styles.searchBarInner}>
                        <Ionicons
                            name="search"
                            size={20}
                            color="rgba(255,255,255,0.6)"
                            style={styles.icon}
                        />
                        <TextInput
                            placeholder={placeholder}
                            placeholderTextColor="rgba(255,255,255,0.4)"
                            style={styles.input}
                            value={value}
                            onChangeText={onChangeText}
                        />
                    </View>
                </Animated.View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    keyboardWrapper: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 75,
        top: 0,
        justifyContent: "flex-end",
        alignItems: "center",
        zIndex: 0,
    },
    container: {
        width: "100%",
        alignItems: "center",
        paddingBottom: 5,
    },
    searchBar: {
        backgroundColor: "#2a2b2a",
        borderRadius: 25,
        boxShadow: "0px 4px 5px rgba(0, 0, 0, 0.3)",
        elevation: 8,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
        overflow: "hidden", // crop when width is tiny
        height: 42,
    },
    searchBarInner: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 13,
        height: "100%",
        width: COLLAPSED_WIDTH, // Make sure inner content isn't squished to wrap
    },
    icon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        color: "#ffffff",
        fontSize: 14,
        padding: 0, // removed padding vertical 10, relying on height
    },
});
