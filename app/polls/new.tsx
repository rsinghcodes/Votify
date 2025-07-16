import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import Feather from '@expo/vector-icons/Feather';
import { Redirect, router, Stack } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import MinimalAlert from '../../lib/MinimalAlert';
import MinimalButton from '../../lib/MinimalButton';
import { colors, fontSizes, spacing } from '../../lib/theme';

export default function CreatePoll() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [error, setError] = useState('');
  const [alert, setAlert] = useState<{
    visible: boolean;
    message: string;
    type?: 'info' | 'error' | 'success';
  }>({ visible: false, message: '' });

  const { user } = useAuth();

  const createPoll = async () => {
    setError('');
    if (!question) {
      setError('Please provide the question');
      return;
    }
    const validOptions = options.filter((o) => !!o);
    if (validOptions.length < 2) {
      setError('Please provide at least 2 valid options');
      return;
    }

    const { data, error } = await supabase
      .from('polls')
      .insert([{ question, options: validOptions }] as any)
      .select();

    if (error) {
      setAlert({
        visible: true,
        message: 'Failed to create the poll',
        type: 'error',
      });
      return;
    }

    router.back();
  };

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <View style={styles.container}>
      <MinimalAlert
        visible={alert.visible}
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ ...alert, visible: false })}
      />
      <Stack.Screen options={{ title: 'Create Poll' }} />
      <Text style={styles.label}>Question</Text>
      <TextInput
        value={question}
        onChangeText={setQuestion}
        placeholder="Type your question here..."
        style={styles.input}
        placeholderTextColor={colors.muted}
      />
      <Text style={styles.label}>Options</Text>
      {options.map((option, index) => (
        <View key={index} style={styles.optionRow}>
          <TextInput
            value={option}
            onChangeText={(text) => {
              const updated = [...options];
              updated[index] = text;
              setOptions(updated);
            }}
            placeholder={`Option ${index + 1}`}
            style={[styles.input, styles.optionInput]}
            placeholderTextColor={colors.muted}
          />
          <Feather
            name="x"
            size={18}
            color={colors.muted}
            onPress={() => {
              const updated = [...options];
              updated.splice(index, 1);
              setOptions(updated);
            }}
            style={styles.removeIcon}
          />
        </View>
      ))}
      <MinimalButton
        title="Add Option"
        onPress={() => setOptions([...options, ''])}
      />
      <MinimalButton title="Create Poll" onPress={createPoll} />
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    gap: spacing.md,
    backgroundColor: colors.background,
    flex: 1,
  },
  label: {
    fontWeight: '600',
    fontSize: fontSizes.md,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: fontSizes.md,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  removeIcon: {
    marginLeft: spacing.sm,
  },
  error: {
    color: 'crimson',
    fontSize: fontSizes.sm,
    marginTop: spacing.sm,
  },
  optionInput: {
    flex: 1,
  },
});
