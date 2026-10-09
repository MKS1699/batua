import { colors } from '@/theme';
import React from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import AppText from './AppText';

type ButtonVariant = 'primary' | 'dark' | 'secondary' | 'danger';

interface AppButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
  variant?: ButtonVariant;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: StyleProp<ViewStyle>;
}

export default function AppButton({
  label,
  variant = 'primary',
  disabled = false,
  icon,
  iconPosition = 'left',
  style,
  ...props
}: AppButtonProps) {
  const backgroundColor = {
    primary: colors.actionPrimary,
    dark: colors.textPrimary,
    secondary: colors.surface,
    danger: colors.statusError,
  }[variant];

  const textColor = variant === 'dark' ? colors.surface : colors.textPrimary;

  const iconElement = icon
    ? React.cloneElement(icon as React.ReactElement<{ color?: string }>, {
        color: disabled ? colors.textSecondary : textColor,
      })
    : null;

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
      <View style={styles.content}>
        {iconPosition === 'left' && iconElement}

        <AppText
          variant="bodyImportant"
          style={{
            color: disabled ? colors.textSecondary : textColor,
            textAlign: 'center',
          }}
        >
          {label}
        </AppText>

        {iconPosition === 'right' && iconElement}
      </View>
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
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});
