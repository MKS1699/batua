import { colors } from '@/theme';
import { useRouter } from 'expo-router';
import { CaretLeftIcon } from 'phosphor-react-native';
import { Pressable, View } from 'react-native';
import { AppText } from './ui';

interface ScreenHeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
}

const ScreenHeader = ({ title, showBack = true, onBack }: ScreenHeaderProps) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <View
      style={{
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        borderWidth: 2,
        borderColor: colors.borderStrong,
        borderLeftWidth: 0,
        borderRightWidth: 0,
      }}
    >
      {showBack && (
        <Pressable
          onPress={handleBack}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={{
            position: 'absolute',
            left: 16,
            height: 48,
            justifyContent: 'center',
          }}
        >
          <CaretLeftIcon size={24} color={colors.textPrimary} weight="bold" />
        </Pressable>
      )}

      <AppText
        variant="screenHeading"
        style={{
          color: colors.textPrimary,
          textAlign: 'center',
        }}
        numberOfLines={1}
      >
        {title}
      </AppText>
    </View>
  );
};

export default ScreenHeader;
