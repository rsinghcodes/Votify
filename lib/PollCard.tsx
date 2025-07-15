import AntDesign from '@expo/vector-icons/AntDesign';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, fontSizes, spacing } from './theme';

interface PollCardProps {
  title: string;
  options: number;
  votes: number;
  onPress?: () => void;
  style?: ViewStyle;
}

const accent = '#f59e42'; // orange-400
const gradientColors = ['rgba(255, 247, 237, 0.8)', 'rgba(241, 245, 249, 0.8)']; // soft orange to light gray with transparency

const PollCard = React.forwardRef<any, PollCardProps>(
  ({ title, options, votes, onPress, style }, ref) => (
    <Pressable
      ref={ref}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed, style]}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.row}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.badge}>Popular</Text>
          <AntDesign
            name="right"
            size={22}
            color={accent}
            style={styles.arrow}
          />
        </View>
        <Text style={styles.subtitle}>
          {options} options • {votes} votes
        </Text>
      </LinearGradient>
    </Pressable>
  )
);

export default PollCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: spacing.lg,
    marginVertical: spacing.sm,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  gradient: {
    borderRadius: spacing.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backdropFilter: 'blur(10px)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: fontSizes.lg + 2,
    fontWeight: 'bold',
    color: colors.text,
    letterSpacing: 0.2,
  },
  badge: {
    backgroundColor: accent,
    color: 'white',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.sm,
    marginLeft: spacing.sm,
  },
  subtitle: {
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  arrow: {
    marginLeft: spacing.lg,
  },
  pressed: {
    opacity: 0.92,
  },
});
