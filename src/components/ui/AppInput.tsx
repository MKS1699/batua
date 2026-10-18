import { colors, fonts } from '@/theme';
import type { ReactNode } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps, type ViewStyle } from 'react-native';
import AppText from './AppText';

type InputIconPosition = 'start' | 'end' | 'beforeLabel' | 'afterLabel';

interface AppInputProps extends TextInputProps {
  label: string;
  error?: string;
  containerStyle?: ViewStyle;
  icon?: ReactNode;
  iconPosition?: InputIconPosition;
}

export default function AppInput({
  label,
  error,
  containerStyle,
  style,
  icon,
  iconPosition = 'start',
  ...props
}: AppInputProps) {
  const isLabelIcon = iconPosition === 'beforeLabel' || iconPosition === 'afterLabel';

  return (
    <View style={containerStyle}>
      {isLabelIcon ? (
        <View style={styles.labelRow}>
          {iconPosition === 'beforeLabel' && icon}

          <AppText variant="bodyImportant" style={styles.label}>
            {label}
          </AppText>

          {iconPosition === 'afterLabel' && icon}
        </View>
      ) : (
        <AppText variant="bodyImportant" style={styles.label}>
          {label}
        </AppText>
      )}

      <View style={[styles.inputContainer, error ? styles.inputError : undefined]}>
        {iconPosition === 'start' && icon}

        <TextInput
          {...props}
          accessibilityLabel={label || props.placeholder}
          placeholderTextColor={colors.textSecondary}
          selectionColor={colors.textPrimary}
          style={[
            styles.input,
            iconPosition === 'start' && styles.inputWithStartIcon,
            iconPosition === 'end' && styles.inputWithEndIcon,
            style,
          ]}
        />

        {iconPosition === 'end' && icon}
      </View>

      {error ? (
        <AppText variant="metadata" accessibilityRole="alert" style={styles.error}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  inputContainer: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 6,
  },
  input: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 10,
    color: colors.textPrimary,
    fontFamily: fonts.regular,
    fontSize: 16,
  },
  inputWithStartIcon: {
    marginLeft: 8,
  },
  inputWithEndIcon: {
    marginRight: 8,
  },
  inputError: {
    borderColor: colors.statusError,
  },
  error: {
    marginTop: 6,
    color: colors.statusError,
  },
});
