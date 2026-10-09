import { colors, fonts } from '@/theme';
import { StyleSheet, TextInput, View, type TextInputProps, type ViewStyle } from 'react-native';
import AppText from './AppText';

interface AppInputProps extends TextInputProps {
  label: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export default function AppInput({ label, error, containerStyle, style, ...props }: AppInputProps) {
  return (
    <View style={containerStyle}>
      <AppText variant="bodyImportant" style={styles.label}>
        {label}
      </AppText>

      <TextInput
        {...props}
        accessibilityLabel={label}
        placeholderTextColor={colors.textSecondary}
        selectionColor={colors.textPrimary}
        style={[styles.input, error ? styles.inputError : undefined, style]}
      />

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
  input: {
    minHeight: 48,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 6,
    fontFamily: fonts.regular,
    fontSize: 16,
  },
  inputError: {
    borderColor: colors.statusError,
  },
  error: {
    marginTop: 6,
    color: colors.statusError,
  },
});
