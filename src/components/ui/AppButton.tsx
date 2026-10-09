import { colors } from '@/theme';
import { Pressable, StyleSheet, type PressableProps, type ViewStyle } from 'react-native';
import AppText from './AppText';

type ButtonVariant = 'primary' | 'dark' | 'secondary';

interface AppButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
  variant?: ButtonVariant;
  style?: ViewStyle;
}

export default function AppButton({
  label,
  variant = 'primary',
  disabled = false,
  style,
  ...props
}: AppButtonProps) {
  const backgroundColor = {
    primary: colors.actionPrimary,
    dark: colors.textPrimary,
    secondary: colors.surface,
  }[variant];

  const textColor = variant === 'dark' ? colors.surface : colors.textPrimary;

  return (
    <Pressable
      {...props}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: disabled ? colors.background : backgroundColor,
          borderColor: disabled ? colors.borderSubtle : colors.borderStrong,
          transform: [{ translateY: pressed && !disabled ? 1 : 0 }],
        },
        style,
      ]}
    >
      <AppText
        variant="bodyImportant"
        style={{
          color: disabled ? colors.textSecondary : textColor,
          textAlign: 'center',
        }}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
