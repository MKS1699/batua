import { Stack } from 'expo-router';

export default function TransactionLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="createTransaction"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
