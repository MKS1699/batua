import AppBootstrap from '@/components/AppBootstrap';
import StoreProvider from '@/store/StoreProvider';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'JetBrainsMono-Regular': require('@/assets/fonts/JetBrainsMono-Regular.ttf'),
    'JetBrainsMono-Medium': require('@/assets/fonts/JetBrainsMono-Medium.ttf'),
    'JetBrainsMono-Bold': require('@/assets/fonts/JetBrainsMono-Bold.ttf'),
    'JetBrainsMono-Italic': require('@/assets/fonts/JetBrainsMono-Italic.ttf'),
    'JetBrainsMono-MediumItalic': require('@/assets/fonts/JetBrainsMono-MediumItalic.ttf'),
    'JetBrainsMono-BoldItalic': require('@/assets/fonts/JetBrainsMono-BoldItalic.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StoreProvider>
        <AppBootstrap>
          <Stack screenOptions={{ headerShown: false }}>
            {/* tabs screens */}
            <Stack.Screen name="(tabs)" />
            {/* transaction screens */}
            <Stack.Screen name="transaction" />
          </Stack>
          <StatusBar />
        </AppBootstrap>
      </StoreProvider>
    </SafeAreaProvider>
  );
}
