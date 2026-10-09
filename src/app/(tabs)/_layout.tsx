import { Tabs } from 'expo-router';
import { ChartLineIcon, HouseIcon, UserIcon, WalletIcon } from 'phosphor-react-native';
import { Pressable } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#236C50',
        tabBarStyle: {
          paddingTop: 10,
          backgroundColor: '#fff',
        },
        tabBarButton: ({ ref, ...props }) => (
          <Pressable
            {...props}
            android_ripple={{
              color: 'transparent',
            }}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Budget Planner',
          tabBarIcon: ({ color, focused }) => (
            <HouseIcon size={36} color={String(color)} weight={focused ? 'fill' : 'light'} />
          ),
        }}
      />
      <Tabs.Screen
        name="budget"
        options={{
          title: 'Budget',
          tabBarIcon: ({ color, focused }) => (
            <WalletIcon size={36} color={String(color)} weight={focused ? 'fill' : 'light'} />
          ),
        }}
      />
      <Tabs.Screen
        name="display"
        options={{
          title: 'Display',
          tabBarIcon: ({ color, focused }) => (
            <ChartLineIcon size={36} color={String(color)} weight={focused ? 'fill' : 'light'} />
          ),
        }}
      />
      <Tabs.Screen
        name="user"
        options={{
          title: 'User',
          tabBarIcon: ({ color, focused }) => (
            <UserIcon size={36} color={String(color)} weight={focused ? 'fill' : 'light'} />
          ),
        }}
      />
    </Tabs>
  );
}
