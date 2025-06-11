import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { Poll, Vote } from '@/types/db';
import Feather from '@expo/vector-icons/Feather';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function PollDetails() {
  const [poll, setPoll] = useState<Poll>();
  const [selected, setSelected] = useState('React Native');
  const { id } = useLocalSearchParams<{ id: string }>();
  const [userVote, setUserVote] = useState<Vote>();

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

    const fetchUserVote = async () => {
      if (!user) {
        return;
      }
      let { data, error } = await supabase
        .from('votes')
        .select('*')
        .eq('poll_id', Number.parseInt(id))
        .eq('user_id', user.id)
        .limit(1)
        .single();

      setUserVote(data);
      if (data) {
        setSelected(data.option);
      }
    };

    fetchPolls();
    fetchUserVote();
  }, []);

  const vote = async () => {
    const newVote = {
      option: selected,
      poll_id: poll?.id,
      user_id: user?.id,
    };
    if (userVote) {
      newVote.id = userVote.id;
    }
    const { data, error } = await supabase
      .from('votes')
      .upsert([newVote])
      .select()
      .single();

    if (error) {
      console.log(error);
      Alert.alert('Failed to vote');
    } else {
      setUserVote(data);
      Alert.alert('Thank you for your vote');
    }
  };

  if (!poll) {
    return <ActivityIndicator />;
  }

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
