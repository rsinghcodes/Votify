import AuthProvider from '@/providers/AuthProvider';
import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { colors } from '../lib/theme';

export default function RootLayout() {
  return (
    <View style={styles.container}>
      <AuthProvider>
        <Stack>
          <Stack.Screen name="(auth)" options={{ title: 'Login' }} />
          <Stack.Screen name="(protected)" options={{ title: 'Profile' }} />
        </Stack>
      </AuthProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
