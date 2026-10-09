import { typography } from '@/theme';
import { Text, type TextProps } from 'react-native';

type TextVariant = keyof typeof typography;

interface AppTextProps extends TextProps {
  variant?: TextVariant;
}

export default function AppText({ variant = 'body', style, ...props }: AppTextProps) {
  return <Text {...props} style={[typography[variant], style]} />;
}
