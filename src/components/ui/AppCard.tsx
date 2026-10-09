import { colors } from '@/theme';
import { StyleSheet, View, type ViewProps, type ViewStyle } from 'react-native';

interface AppCardProps extends ViewProps {
  backgroundColor?: string;
  style?: ViewStyle;
}

export default function AppCard({
  backgroundColor = colors.surface,
  style,
  ...props
}: AppCardProps) {
  return <View {...props} style={[styles.card, { backgroundColor }, style]} />;
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 8,
  },
});
