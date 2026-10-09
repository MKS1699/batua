import AppBootstrap from '@/components/AppBootstrap';
import StoreProvider from '@/store/StoreProvider';
import { fonts } from '@/theme';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    [fonts.regular]: require('@/assets/fonts/JetBrainsMono-Regular.ttf'),
    [fonts.medium]: require('@/assets/fonts/JetBrainsMono-Medium.ttf'),
    [fonts.bold]: require('@/assets/fonts/JetBrainsMono-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StoreProvider>
        <AppBootstrap>
          <Stack>
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: false,
              }}
            />
          </Stack>
          <StatusBar />
        </AppBootstrap>
      </StoreProvider>
    </SafeAreaProvider>
  );
}
