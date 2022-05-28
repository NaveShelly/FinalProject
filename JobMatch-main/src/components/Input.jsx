import React from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

export default function Input({ value, onChange, placeholder, secureTextEntry, style }) {
   return (
    <TextInput
      autoCapitalize='none'
      autoCorrect={false}
      value={value}
      onChangeText={onChange}
      style={[styles.input, style]}
      //onBlur={onBlur}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
    /> 
   ) 
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'white',
    height: hp('6%'),
    borderColor: '#000',
    paddingLeft: hp('2%'),
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 5,
  },
});