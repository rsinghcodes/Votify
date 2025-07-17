import AntDesign from '@expo/vector-icons/AntDesign';
import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, fontSizes, spacing } from './theme';

interface PollCardProps {
  title: string;
  optionCount: number;
  voteCount: number;
  onPress?: () => void;
  style?: ViewStyle;
}

const PollCard = React.forwardRef<any, PollCardProps>(
  ({ title, optionCount, voteCount, onPress, style }, ref) => (
    <Pressable
      ref={ref}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed, style]}
    >
      <View style={styles.content}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.meta}>
              {optionCount} option{optionCount !== 1 ? 's' : ''}
            </Text>
            <Text style={styles.meta}>
              · {voteCount} vote{voteCount !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>
        <View style={styles.arrowContainer}>
          <AntDesign name="arrowright" size={18} color={colors.primary} />
        </View>
      </View>
    </Pressable>
  )
);

export default PollCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginBottom: spacing.xs, // Reduced vertical spacing
    backgroundColor: colors.background,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    fontSize: fontSizes.lg,
    color: colors.text,
    fontWeight: '500',
    lineHeight: 24,
  },
  arrowContainer: {
    marginLeft: spacing.md,
    backgroundColor: colors.background,
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    backgroundColor: colors.background,
  },
  metaRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: 4,
  },
  meta: {
    fontSize: fontSizes.sm,
    color: colors.muted,
  },
});
