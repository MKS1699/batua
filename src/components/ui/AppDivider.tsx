import { colors } from '@/theme';
import { View, ViewProps, ViewStyle } from 'react-native';

type SlantingAngle = `${number}deg`;
interface AppDividerProps extends ViewProps {
  width?: ViewStyle['width'];
  bgColor?: ViewStyle['backgroundColor'];
  height?: ViewStyle['height'];
  style?: ViewStyle;
  rounded?: boolean;
  orientation?: 'horizontal' | 'vertical';
  slanting?: 'left' | 'right';
  slantingAngle?: SlantingAngle;
}

const AppDivider = ({
  width = 2,
  bgColor = colors.borderStrong,
  height = '100%',
  rounded = false,
  orientation = 'vertical',
  slanting,
  slantingAngle,
  style,
  ...props
}: AppDividerProps) => {
  const orientationDimensions: ViewStyle =
    orientation === 'horizontal'
      ? { width: width ?? '100%', height: height ?? 2 }
      : { width: width ?? 2, height: height ?? '100%' };

  const rotation: SlantingAngle =
    slanting === 'right'
      ? (slantingAngle ?? '25deg')
      : slanting === 'left'
        ? (slantingAngle ?? '-25deg')
        : '0deg';

  return (
    <View
      {...props}
      style={[
        orientationDimensions,
        { backgroundColor: bgColor, borderRadius: rounded ? 999 : 0 },
        { transform: [{ rotate: rotation }] },
        style,
      ]}
    />
  );
};

export default AppDivider;
