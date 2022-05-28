import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, Feather, FontAwesome } from '@expo/vector-icons';
import { Home, Profile } from '../screens';

const BottomTab = createBottomTabNavigator();

export function BottomTabNavigator() {

    const screenOptions = ({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Home') {
             if (focused) {
               return <Ionicons name="home" size={24} color="#158340" />  
             }
               return <Ionicons name="home-outline" size={24} color="#158340" />
          }

          if (route.name === 'Profile') {
            if (focused) {
              return <FontAwesome name="user" size={24} color="#158340" />
            }
              return <Feather name="user" size={24} color="#158340" />
         }
        }
     });
  
     const tabBarOptions = {
       showLabel: false,
       style: {
        borderTopWidth: 0.2,
        borderTopColor: '#158340',
        backgroundColor: '#000000'
      }
    }; 

  return (
    <BottomTab.Navigator
      initialRouteName = "Home" 
      screenOptions = {screenOptions}
      tabBarOptions = {tabBarOptions}
     >
       <BottomTab.Screen name = "Home" component = {Home} />
       <BottomTab.Screen name = "Profile" component = {Profile} />
    </BottomTab.Navigator>
  )  
}