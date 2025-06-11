import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { Poll } from '@/types/db';
import Feather from '@expo/vector-icons/Feather';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Button, Pressable, StyleSheet, Text, View } from 'react-native';

export default function PollDetails() {
  const [poll, setPoll] = useState<Poll>({});
  const [selected, setSelected] = useState('React Native');
  const { id } = useLocalSearchParams<{ id: string }>();

  const { user } = useAuth();

  useEffect(() => {
    const fetchPolls = async () => {
      let { data, error } = await supabase
        .from('polls')
        .select('*')
        .eq('id', Number.parseInt(id))
        .single();
      if (error) {
        Alert.alert('Error fetching data');
      }

      setPoll(data);
    };

    fetchPolls();
  }, []);

  const vote = () => {
    console.warn('Voted: ', selected);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Poll voting' }} />
      <Text style={styles.question}>{poll?.question}</Text>
      <View style={{ gap: 5 }}>
        {poll?.options?.map((option, idx) => (
          <Pressable
            onPress={() => setSelected(option)}
            style={styles.optionConatiner}
            key={idx}
          >
            <Feather
              name={option === selected ? 'check-circle' : 'circle'}
              size={18}
              color={option === selected ? 'green' : 'gray'}
            />
            <Text>{option}</Text>
          </Pressable>
        ))}
      </View>

      <Button onPress={vote} title="Vote" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10, gap: 10 },
  question: { fontSize: 20, fontWeight: 600 },
  optionConatiner: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
});
