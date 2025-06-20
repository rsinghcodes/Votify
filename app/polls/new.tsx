import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import Feather from '@expo/vector-icons/Feather';
import { Redirect, router, Stack } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function CreatePoll() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [error, setError] = useState('');

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
      .insert([{ question, options: validOptions }])
      .select();

    if (error) {
      Alert.alert('Failed to create the poll');
      return;
    }

    router.back();
  };

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Create Poll' }} />
      <Text style={styles.label}>Title</Text>
      <TextInput
        value={question}
        onChangeText={setQuestion}
        placeholder="Type your question here..."
        style={styles.input}
      />
      <Text style={styles.label}>Title</Text>
      {options.map((option, index) => (
        <View key={index} style={{ justifyContent: 'center' }}>
          <TextInput
            value={option}
            onChangeText={(text) => {
              const updated = [...options];
              updated[index] = text;
              setOptions(updated);
            }}
            placeholder={`Option ${index + 1}`}
            style={styles.input}
          />
          <Feather
            name="x"
            size={18}
            color="gray"
            onPress={() => {
              const updated = [...options];
              updated.splice(index, 1);
              setOptions(updated);
            }}
            style={{ position: 'absolute', right: 10 }}
          />
        </View>
      ))}
      <Button title="Add Option" onPress={() => setOptions([...options, ''])} />
      <Button title="Create Poll" onPress={createPoll} />
      <Text style={{ color: 'crimson' }}>{error}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    gap: 5,
  },
  label: {
    fontWeight: '500',
    marginTop: 10,
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
});
