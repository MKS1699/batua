import { ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ScreenContainerProps = ViewProps & {
  padding?: number;
};

const ScreenContainer = ({ padding = 10, style, children, ...props }: ScreenContainerProps) => {
  return (
    <SafeAreaView
      edges={['top']}
      style={[{ flex: 1, backgroundColor: '#F4F4F0', padding }, style]}
      {...props}
    >
      {children}
    </SafeAreaView>
  );
};

export default ScreenContainer;
