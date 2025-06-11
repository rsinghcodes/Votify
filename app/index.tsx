import { supabase } from '@/lib/supabase';
import { Poll } from '@/types/db';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Link, router, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text } from 'react-native';

export default function HomeScreen() {
  const [polls, setPolls] = useState<Poll[]>([]);

  useEffect(() => {
    const fetchPolls = async () => {
      let { data, error } = await supabase.from('polls').select('*');
      if (error) {
        Alert.alert('Error fetching polls...');
      }
      setPolls(data);
    };

    fetchPolls();
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Polls',
          headerRight: () => (
            <AntDesign
              onPress={() => router.push('/polls/new')}
              name="plus"
              size={20}
              color="gray"
            />
          ),
          headerLeft: () => (
            <AntDesign
              onPress={() => router.push('/profile')}
              name="user"
              size={20}
              color="gray"
            />
          ),
        }}
      />
      <FlatList
        data={polls}
        contentContainerStyle={styles.container}
        renderItem={({ item }) => (
          <Link href={`/polls/${item.id}`} style={styles.pollContainer}>
            <Text style={styles.pollTitle}>{item.question}</Text>
          </Link>
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    gap: 5,
  },
  pollContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  pollTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
