import { ScrollView, StyleProp, View, ViewProps, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ScrollMode = 'none' | 'vertical' | 'horizontal';

type ScreenContainerProps = ViewProps & {
  padding?: number;
  scroll?: ScrollMode;
  noSafeArea?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
  showsVerticalScrollIndicator?: boolean;
  showsHorizontalScrollIndicator?: boolean;
};

const ScreenContainer = ({
  padding = 10,
  scroll = 'none',
  noSafeArea = false,
  style,
  children,
  contentContainerStyle,
  showsVerticalScrollIndicator = false,
  showsHorizontalScrollIndicator = false,
  ...props
}: ScreenContainerProps) => {
  const containerStyle: StyleProp<ViewStyle> = [
    {
      flex: 1,
      backgroundColor: '#F4F4F0',
      padding,
    },
    style,
  ];

  const content =
    scroll === 'none' ? (
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
    );

  if (noSafeArea) {
    return (
      <View style={containerStyle} {...props}>
        {content}
      </View>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={containerStyle} {...props}>
      {content}
    </SafeAreaView>
  );
};

export default ScreenContainer;
