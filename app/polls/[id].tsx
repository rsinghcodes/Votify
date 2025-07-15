import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { Poll, Vote } from '@/types/db';
import Feather from '@expo/vector-icons/Feather';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MinimalButton from '../../lib/MinimalButton';
import { colors, fontSizes, spacing } from '../../lib/theme';

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
      <View style={styles.optionsList}>
        {poll?.options?.map((option, idx) => (
          <Pressable
            onPress={() => setSelected(option)}
            style={[
              styles.optionContainer,
              selected === option && styles.optionSelected,
            ]}
            key={idx}
          >
            <Feather
              name={option === selected ? 'check-circle' : 'circle'}
              size={20}
              color={option === selected ? colors.primary : colors.muted}
            />
            <Text style={styles.optionText}>{option}</Text>
          </Pressable>
        ))}
      </View>
      <MinimalButton onPress={vote} title="Vote" style={styles.voteButton} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, gap: spacing.lg },
  question: {
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
  },
  optionsList: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  optionContainer: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: '#eef2ff',
  },
  optionText: {
    fontSize: fontSizes.md,
    color: colors.text,
  },
  voteButton: {
    marginTop: spacing.lg,
  },
});
