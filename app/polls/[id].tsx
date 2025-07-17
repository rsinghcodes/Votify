import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { Poll, Vote } from '@/types/db';
import { TablesInsert } from '@/types/supabase';
import Feather from '@expo/vector-icons/Feather';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MinimalAlert from '../../lib/MinimalAlert';
import MinimalButton from '../../lib/MinimalButton';
import MinimalSpinner from '../../lib/MinimalSpinner';
import { colors, fontSizes, spacing } from '../../lib/theme';

export default function PollDetails() {
  const [poll, setPoll] = useState<Poll>();
  const [selected, setSelected] = useState('React Native');
  const { id } = useLocalSearchParams<{ id: string }>();
  const [userVote, setUserVote] = useState<Vote>();
  const [alert, setAlert] = useState<{
    visible: boolean;
    message: string;
    type?: 'info' | 'error' | 'success';
  }>({ visible: false, message: '' });
  const [voteCounts, setVoteCounts] = useState<Record<string, number> | null>(
    null
  );
  const [loadingVotes, setLoadingVotes] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    const fetchPolls = async () => {
      let { data, error } = await supabase
        .from('polls')
        .select('*')
        .eq('id', id as any)
        .single();
      if (error || !data) {
        setAlert({
          visible: true,
          message: 'Error fetching data',
          type: 'error',
        });
        setPoll(undefined);
        return;
      }
      setPoll(data as unknown as Poll);
    };

    const fetchUserVote = async () => {
      if (!user) {
        return;
      }
      let { data, error } = await supabase
        .from('votes')
        .select('*')
        .eq('poll_id', id as any)
        .eq('user_id', user.id as any)
        .limit(1)
        .single();
      if (data && !error) {
        setUserVote(data as unknown as Vote);
        setSelected((data as unknown as Vote).option);
      } else {
        setUserVote(undefined);
      }
    };

    fetchPolls();
    fetchUserVote();
  }, []);

  const fetchVoteCounts = useCallback(async () => {
    setLoadingVotes(true);
    const { data, error } = await supabase
      .from('votes')
      .select('option, poll_id');
    if (!error && data && poll) {
      const counts: Record<string, number> = {};
      for (const opt of poll.options) {
        counts[opt] = data.filter(
          (v: any) => v.option === opt && v.poll_id === poll.id
        ).length;
      }
      setVoteCounts(counts);
    }
    setLoadingVotes(false);
  }, [poll]);

  // Fetch vote counts on mount
  useEffect(() => {
    if (!poll) return;
    fetchVoteCounts();
  }, [poll, fetchVoteCounts]);

  const handleOptionPress = (option: string) => {
    setSelected(option);
  };

  const vote = async () => {
    const newVote: TablesInsert<'votes'> = {
      option: selected,
      poll_id: poll?.id as number,
      user_id: user?.id as string,
    };
    if (userVote) {
      newVote.id = userVote.id;
    }
    const { data, error } = await supabase
      .from('votes')
      .upsert([newVote as any])
      .select()
      .single();

    if (error || !data) {
      setAlert({ visible: true, message: 'Failed to vote', type: 'error' });
    } else {
      setUserVote(data as unknown as Vote);
      setAlert({
        visible: true,
        message: 'Thank you for your vote',
        type: 'success',
      });
      // Refresh vote counts after voting
      await fetchVoteCounts();
    }
  };

  if (!poll) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <MinimalSpinner />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MinimalAlert
        visible={alert.visible}
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ ...alert, visible: false })}
      />
      <Stack.Screen options={{ title: 'Poll voting' }} />
      <Text style={styles.question}>{poll?.question}</Text>
      <View style={styles.optionsList}>
        {poll?.options?.map((option, idx) => (
          <Pressable
            onPress={() => handleOptionPress(option)}
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
            {voteCounts && (
              <Text style={styles.voteCount}>
                {loadingVotes
                  ? '...'
                  : `${voteCounts[option] ?? 0} vote${
                      (voteCounts[option] ?? 0) !== 1 ? 's' : ''
                    }`}
              </Text>
            )}
          </Pressable>
        ))}
      </View>
      <MinimalButton onPress={vote} title="Vote" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, gap: spacing.lg },
  question: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    color: colors.text,
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
  voteCount: {
    marginLeft: spacing.md,
    fontSize: fontSizes.md,
    color: colors.primary,
    fontWeight: '500',
  },
});
