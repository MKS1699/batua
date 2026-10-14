import { colors } from '@/theme';
import { StyleSheet, View } from 'react-native';

type ProgressBarProps = {
  current: number;
  total: number;
  filledColor: keyof typeof colors;
  emptyColor: keyof typeof colors;
};

const ProgressBar = ({ current, total, filledColor, emptyColor }: ProgressBarProps) => {
  const percentage = total > 0 ? Math.min(Math.max((current / total) * 100, 0), 100) : 0;

  return (
    <View style={[styles.container, { backgroundColor: colors[emptyColor] }]}>
      <View
        style={[
          styles.fill,
          {
            width: `${percentage}%`,
            backgroundColor: colors[filledColor],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 8,
    width: '100%',
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
});

export default ProgressBar;
