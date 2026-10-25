import { Stack } from 'expo-router';

export default function BudgetLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="createBudget"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
