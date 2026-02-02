// app/(app)/(tabs)/tickets.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../../shared/context/ThemeContext';
import { useTicketsStore } from '../../../features/tickets/store';
import { TicketCard } from '../../../features/tickets/components/TicketCard';
import { SearchBar } from '../../../components/ui/SearchBar';
import { Loader } from '../../../components/ui/Loader';
import { spacing } from '../../../shared/theme';
import { Plus } from 'lucide-react-native';
import { Button } from '../../../components/ui/Button';

export default function TicketsScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const {
        filteredTickets,
        isLoading,
        fetchTickets,
        searchTickets,
        searchQuery
    } = useTicketsStore();

    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchTickets();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchTickets();
        setRefreshing(false);
    };

    const renderHeader = () => (
        <View style={[styles.header, { backgroundColor: colors.background }]}>
            <SearchBar
                value={searchQuery}
                onChangeText={searchTickets}
                placeholder="Search tickets..."
                style={styles.searchBar}
            />
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {isLoading && !refreshing && filteredTickets.length === 0 ? (
                <Loader fullScreen message="Loading tickets..." />
            ) : (
                <FlatList
                    data={filteredTickets}
                    renderItem={({ item }) => <TicketCard ticket={item} />}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    ListHeaderComponent={renderHeader}
                    stickyHeaderIndices={[0]}
                />
            )}

            {/* FAB for creating ticket */}
            <View style={styles.fabContainer}>
                <Button
                    size="icon"
                    style={[styles.fab, { backgroundColor: colors.primary, shadowColor: colors.primary }]}
                    onPress={() => { /* Navigate to create ticket */ }}
                >
                    <Plus color="#fff" size={24} />
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        marginBottom: spacing.sm,
    },
    searchBar: {
        marginBottom: 0,
    },
    listContent: {
        paddingHorizontal: spacing.lg,
        paddingBottom: 100, // Space for FAB
    },
    fabContainer: {
        position: 'absolute',
        bottom: spacing.xl,
        right: spacing.xl,
    },
    fab: {
        width: 56,
        height: 56,
        borderRadius: 28,
        elevation: 6,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
    },
});
