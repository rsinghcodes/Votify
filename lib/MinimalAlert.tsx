import AntDesign from '@expo/vector-icons/AntDesign';
import React from 'react';
import { Dimensions, Modal, StyleSheet, Text, View } from 'react-native';
import MinimalButton from './MinimalButton';
import { colors, fontSizes, spacing } from './theme';

const icons = {
  info: { name: 'infocirlceo', color: colors.primary },
  error: { name: 'closecircleo', color: 'crimson' },
  success: { name: 'checkcircleo', color: 'green' },
};

interface MinimalAlertProps {
  visible: boolean;
  message: string;
  type?: 'info' | 'error' | 'success';
  onClose: () => void;
}

export default function MinimalAlert({
  visible,
  message,
  type = 'info',
  onClose,
}: MinimalAlertProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <AntDesign
            name={icons[type].name as any}
            size={36}
            color={icons[type].color}
            style={styles.icon}
          />
          <Text style={styles.message}>{message}</Text>
          <MinimalButton title="OK" onPress={onClose} style={styles.button} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: Dimensions.get('window').width * 0.8,
    backgroundColor: colors.card,
    borderRadius: spacing.lg,
    padding: spacing.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  icon: {
    marginBottom: spacing.md,
  },
  message: {
    fontSize: fontSizes.md,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.lg,
    fontWeight: '500',
  },
  button: {
    minWidth: 100,
  },
});
