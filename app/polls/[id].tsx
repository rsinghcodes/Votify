import Feather from '@expo/vector-icons/Feather';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Button, Pressable, StyleSheet, Text, View } from 'react-native';

const poll = {
  question: 'React Native or Flutter?',
  options: ['React Native', 'Flutter', 'SwiftUI'],
};

export default function PollDetails() {
  const [selected, setSelected] = useState('React Native');
  const { id } = useLocalSearchParams<{ id: string }>();

  const vote = () => {
    console.warn('Voted: ', selected);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Poll voting' }} />
      <Text style={styles.question}>{poll.question}</Text>
      <View style={{ gap: 5 }}>
        {poll.options.map((option, idx) => (
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
