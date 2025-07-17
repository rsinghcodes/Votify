import { useAuth } from '@/providers/AuthProvider';
import AntDesign from '@expo/vector-icons/AntDesign';
import { StyleSheet, Text, View } from 'react-native';
import MinimalButton from '../../lib/MinimalButton';
import { supabase } from '../../lib/supabase';
import { colors, fontSizes, spacing } from '../../lib/theme';

export default function ProfileScreen() {
  const { user } = useAuth();

  if (!user) return null;

  // Extract info
  const email = user.email;
  const lastSignIn = user.last_sign_in_at
    ? new Date(user.last_sign_in_at).toLocaleString()
    : '-';
  const isVerified = user.user_metadata?.email_verified || false;

  return (
    <>
      <View style={styles.outer}>
        <View style={styles.card}>
          <View style={styles.avatarContainer}>
            <AntDesign
              name="user"
              size={48}
              color={colors.primary}
              style={styles.avatar}
            />
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.email}>{email}</Text>
            {isVerified && (
              <AntDesign
                name="checkcircle"
                size={20}
                color="green"
                style={styles.verifiedIcon}
                accessibilityLabel="Email verified"
              />
            )}
          </View>
          <Text style={styles.label}>Last sign in</Text>
          <Text style={styles.value}>{lastSignIn}</Text>
        </View>
        <MinimalButton
          title="Sign out"
          onPress={() => supabase.auth.signOut()}
          style={styles.signOutBtn}
        />
      </View>
    </>
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
    backgroundColor: colors.card,
    borderRadius: spacing.lg,
    padding: spacing.xl,
    alignItems: 'center',
    width: '100%',
    maxWidth: 360,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
  },
  avatarContainer: {
    marginBottom: spacing.lg,
    backgroundColor: '#eef2ff',
    borderRadius: 48,
    padding: spacing.md,
  },
  avatar: {},
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  email: {
    fontSize: fontSizes.lg,
    color: colors.text,
    fontWeight: '600',
  },
  verifiedIcon: {
    marginLeft: spacing.xs,
  },
  label: {
    fontSize: fontSizes.sm,
    color: colors.muted,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  value: {
    fontSize: fontSizes.md,
    color: colors.text,
    fontWeight: '400',
  },
  signOutBtn: {
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
  },
});
