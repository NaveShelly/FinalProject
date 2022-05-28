import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Splash, Register, Login, SetProfile, Resume, Match, Chat, Message} from '../screens';
import SwitchEmployerCard from '../screens/SwitchEmployerCard'
import ShowResume from '../screens/ShowResume';
import { BottomTabNavigator } from './BottomTab';

const Stack = createNativeStackNavigator();

export function StackNavigator() {
  const stackScreenOptions = {
    gestureEnabled: false,
  };

  const navScreenOptions = {
    headerShown: false,
  };

  return (
    <Stack.Navigator screenOptions={navScreenOptions} initialRouteName="Splash">
      <Stack.Screen
        options={stackScreenOptions}
        name="Splash"
        component={Splash}
      />
      <Stack.Screen
        options={stackScreenOptions}
        name="Register"
        component={Register}
      />
      <Stack.Screen
        options={stackScreenOptions}
        name="SetProfile"
        component={SetProfile}
      />
      <Stack.Screen
        options={stackScreenOptions}
        name="Login"
        component={Login}
      />
      <Stack.Screen
        options={stackScreenOptions}
        name="Resume"
        component={Resume}
      />
      <Stack.Screen
        options={stackScreenOptions}
        name="Match"
        component={Match}
      />
      <Stack.Screen
        options={stackScreenOptions}
        name="Chat"
        component={Chat}
      />
      <Stack.Screen
        options={stackScreenOptions}
        name="Message"
        component={Message}
      />
      <Stack.Screen
        options={stackScreenOptions}
        name="Tab"
        component={BottomTabNavigator}
      />
      <Stack.Screen
        options={stackScreenOptions}
        name="SwitchEmployerCard"
        component={SwitchEmployerCard}
      />
      <Stack.Screen
        options={stackScreenOptions}
        name="ShowResume"
        component={ShowResume}
      />
    </Stack.Navigator>
  );
}