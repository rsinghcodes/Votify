import AntDesign from '@expo/vector-icons/AntDesign';
import { Link, Stack } from 'expo-router';
import { FlatList, StyleSheet, Text } from 'react-native';

const polls = [
  { id: 1, question: 'President Trump Job Approval' },
  { id: 2, question: 'World' },
  { id: 3, question: 'Jai' },
];

export default function HomeScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Polls',
          headerRight: () => (
            <Link href={'/polls/new'}>
              <AntDesign name="plus" size={20} color="gray" />
            </Link>
          ),
          headerLeft: () => (
            <Link href={'/profile'}>
              <AntDesign name="user" size={20} color="gray" />
            </Link>
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
