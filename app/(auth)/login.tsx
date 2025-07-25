import { supabase } from '@/lib/supabase';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import MinimalAlert from '../../lib/MinimalAlert';
import MinimalButton from '../../lib/MinimalButton';
import { colors, fontSizes, spacing } from '../../lib/theme';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    visible: boolean;
    message: string;
    type?: 'info' | 'error' | 'success';
  }>({ visible: false, message: '' });

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error)
      setAlert({ visible: true, message: error.message, type: 'error' });
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error)
      setAlert({ visible: true, message: error.message, type: 'error' });
    else if (!session)
      setAlert({
        visible: true,
        message: 'Please check your inbox for email verification!',
        type: 'info',
      });
    setLoading(false);
  }

  return (
    <View style={styles.outer}>
      <MinimalAlert
        visible={alert.visible}
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ ...alert, visible: false })}
      />
      <View style={styles.card}>
        <Text style={styles.heading}>Sign In</Text>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="email@address.com"
          placeholderTextColor={colors.muted}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor={colors.muted}
          autoCapitalize="none"
          secureTextEntry
        />
        <MinimalButton
          title="Sign in"
          onPress={signInWithEmail}
          style={styles.button}
        />
        <MinimalButton
          title="Sign up"
          onPress={signUpWithEmail}
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.card,
    borderRadius: spacing.lg,
    padding: spacing.xl,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'stretch',
  },
  heading: {
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  label: {
    fontSize: fontSizes.md,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    fontSize: fontSizes.md,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  button: {
    marginTop: spacing.md,
  },
});
