import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { DataProvider } from './context/DataContext';

// Screens
import LandingScreen from './screens/LandingScreen';
import StudentDashboard from './screens/StudentDashboard';
import StaffDashboard from './screens/StaffDashboard';
import AdminDashboard from './screens/AdminDashboard';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <DataProvider>
      <NavigationContainer>
        <StatusBar style="light" backgroundColor="#1a1a2e" />
        <Stack.Navigator
          initialRouteName="Landing"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#1a1a2e' },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="Landing" component={LandingScreen} />
          <Stack.Screen name="StudentDashboard" component={StudentDashboard} />
          <Stack.Screen name="StaffDashboard" component={StaffDashboard} />
          <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        </Stack.Navigator>
      </NavigationContainer>
    </DataProvider>
  );
}
