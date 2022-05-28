import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StackNavigator } from './Stack';

export default function() {
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
}