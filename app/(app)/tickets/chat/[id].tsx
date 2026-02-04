// app/(app)/tickets/chat/[id].tsx
import React, { useEffect, useState, useRef } from 'react';
import {
    View, Text, StyleSheet, KeyboardAvoidingView,
    Platform, FlatList, TextInput, TouchableOpacity,
    SafeAreaView
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useTicketsStore } from '../../../../features/tickets/store';
import { useTheme } from '../../../../shared/context/ThemeContext';
import { spacing, fontSize, borderRadius } from '../../../../shared/theme';
import { format } from 'date-fns';
import { Send, User, ChevronLeft } from 'lucide-react-native';

export default function TicketChatScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { colors } = useTheme();
    const { getTicketById, addChatMessage } = useTicketsStore();

    const [ticket, setTicket] = useState<any>(null);
    const [inputText, setInputText] = useState('');
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        if (id) {
            const foundTicket = getTicketById(Number(id));
            if (foundTicket) {
                setTicket(foundTicket);
            } else {
                router.back();
            }
        }
    }, [id]);

    const handleSendMessage = async () => {
        if (!inputText.trim()) return;
        await addChatMessage(Number(id), inputText.trim(), 'engineer');
        setInputText('');
        // Refresh local ticket state to show new message
        setTicket(getTicketById(Number(id)));
        // Scroll to bottom
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    };

    if (!ticket) return null;

    const renderMessage = ({ item }: { item: any }) => {
        const isEngineer = item.role === 'engineer';

        return (
            <View style={[
                styles.messageWrapper,
                isEngineer ? styles.messageWrapperRight : styles.messageWrapperLeft
            ]}>
                <View style={[
                    styles.bubble,
                    isEngineer ?
                        [styles.bubbleRight, { backgroundColor: colors.primary }] :
                        [styles.bubbleLeft, { backgroundColor: '#f1f5f9' }] // High contrast light gray
                ]}>
                    <Text style={[
                        styles.senderName,
                        { color: isEngineer ? '#d1d5db' : '#64748b' }
                    ]}>
                        {item.sender}
                    </Text>
                    <Text style={[
                        styles.messageText,
                        { color: isEngineer ? '#ffffff' : '#0f172a' } // Absolute black on light gray for readability
                    ]}>
                        {item.text}
                    </Text>
                    <Text style={[
                        styles.timestamp,
                        { color: isEngineer ? '#93c5fd' : '#94a3b8' }
                    ]}>
                        {format(new Date(item.timestamp), 'h:mm a')}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <Stack.Screen options={{
                title: `Chat - #${ticket.ticketId}`,
                headerShown: true,
                headerLeft: () => (
                    <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 8 }}>
                        <ChevronLeft size={24} color={colors.foreground} />
                    </TouchableOpacity>
                ),
            }} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 80}
                style={styles.container}
            >
                <FlatList
                    ref={flatListRef}
                    data={ticket.chat || []}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderMessage}
                    contentContainerStyle={styles.listContent}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                />

                <View style={[styles.inputArea, {
                    borderTopColor: colors.border,
                    backgroundColor: colors.card,
                    paddingBottom: Platform.OS === 'ios' ? spacing.xl : 30 // Extra padding for system buttons
                }]}>
                    <TextInput
                        style={[styles.input, { color: colors.foreground, backgroundColor: colors.background, borderColor: colors.border }]}
                        placeholder="Type your message..."
                        placeholderTextColor={colors.mutedForeground}
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, { backgroundColor: colors.primary }]}
                        onPress={handleSendMessage}
                        disabled={!inputText.trim()}
                    >
                        <Send size={20} color="#ffffff" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    container: { flex: 1 },
    listContent: {
        padding: spacing.md,
        paddingBottom: spacing.xl,
    },
    messageWrapper: {
        marginBottom: spacing.md,
        flexDirection: 'row',
        width: '100%',
    },
    messageWrapperLeft: {
        justifyContent: 'flex-start',
    },
    messageWrapperRight: {
        justifyContent: 'flex-end',
    },
    bubble: {
        maxWidth: '80%',
        padding: spacing.md,
        borderRadius: 16,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    bubbleLeft: {
        borderBottomLeftRadius: 4,
    },
    bubbleRight: {
        borderBottomRightRadius: 4,
    },
    senderName: {
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    messageText: {
        fontSize: 15,
        lineHeight: 20,
    },
    timestamp: {
        fontSize: 9,
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    inputArea: {
        flexDirection: 'row',
        padding: spacing.sm,
        alignItems: 'center',
        borderTopWidth: 1,
    },
    input: {
        flex: 1,
        minHeight: 40,
        maxHeight: 100,
        borderRadius: 20,
        borderWidth: 1,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: spacing.sm,
        fontSize: 14,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
