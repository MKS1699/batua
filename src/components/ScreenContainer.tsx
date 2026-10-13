import { ScrollView, StyleProp, ViewProps, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ScrollMode = 'none' | 'vertical' | 'horizontal';

type ScreenContainerProps = ViewProps & {
  padding?: number;
  scroll?: ScrollMode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  showsVerticalScrollIndicator?: boolean;
  showsHorizontalScrollIndicator?: boolean;
};

const ScreenContainer = ({
  padding = 10,
  scroll = 'none',
  style,
  children,
  contentContainerStyle,
  showsVerticalScrollIndicator = false,
  showsHorizontalScrollIndicator = false,
  ...props
}: ScreenContainerProps) => {
  return (
    <SafeAreaView
      edges={['top']}
      style={[
        {
          flex: 1,
          backgroundColor: '#F4F4F0',
          padding,
        },
        style,
      ]}
      {...props}
    >
      {scroll === 'none' ? (
        children
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={contentContainerStyle}
          horizontal={scroll === 'horizontal'}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
        >
          {children}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default ScreenContainer;
