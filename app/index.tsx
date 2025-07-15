import { supabase } from '@/lib/supabase';
import { Poll } from '@/types/db';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Link, router, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import PollCard from '../lib/PollCard';
import { colors, spacing } from '../lib/theme';

const headerAccent = '#2563eb'; // blue-600

export default function HomeScreen() {
  const [polls, setPolls] = useState<Poll[]>([]);

  useEffect(() => {
    const fetchPolls = async () => {
      let { data, error } = await supabase.from('polls').select('*');
      if (error) {
        Alert.alert('Error fetching polls...');
      }
      setPolls((data ?? []) as unknown as Poll[]);
    };

    fetchPolls();
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          title: '',
          headerTitle: () => <Text style={styles.headerTitle}>Votify</Text>,
          headerTitleAlign: 'center',
          headerRight: () => (
            <AntDesign
              onPress={() => router.push('/polls/new')}
              name="plus"
              size={24}
              style={{ marginRight: spacing.md }}
            />
          ),
          headerLeft: () => (
            <AntDesign
              onPress={() => router.push('/profile')}
              name="user"
              size={24}
              style={{ marginLeft: spacing.md }}
            />
          ),
        }}
      />
      <View style={styles.container}>
        <FlatList
          data={polls}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Link href={`/polls/${item.id}`} asChild>
              <PollCard title={item.question} />
            </Link>
          )}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
