import { supabase } from '@/lib/supabase';
import { Poll } from '@/types/db';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Link, router, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import MinimalAlert from '../lib/MinimalAlert';
import PollCard from '../lib/PollCard';
import { spacing } from '../lib/theme';

const headerAccent = '#2563eb'; // blue-600

export default function HomeScreen() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [alert, setAlert] = useState<{
    visible: boolean;
    message: string;
    type?: 'info' | 'error' | 'success';
  }>({ visible: false, message: '' });

  useEffect(() => {
    const fetchPolls = async () => {
      let { data, error } = await supabase
        .from('polls')
        .select('*, votes(poll_id)');
      if (error) {
        setAlert({
          visible: true,
          message: 'Error fetching polls...',
          type: 'error',
        });
      }
      setPolls((data ?? []) as unknown as Poll[]);
    };

    fetchPolls();
  }, []);

  return (
    <>
      <MinimalAlert
        visible={alert.visible}
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ ...alert, visible: false })}
      />
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
              <PollCard
                title={item.question}
                optionCount={item.options?.length || 0}
                voteCount={Array.isArray(item.votes) ? item.votes.length : 0}
              />
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
    backgroundColor: '#f6f8fa',
  },
  list: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
