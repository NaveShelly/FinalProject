import { View, Text, StyleSheet, Image, Keyboard, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Breaker, Button, Input, Loader } from '../components';
import { addSibling, destroySibling, showToast } from '../helpers';
import { setUser } from '../store/user';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

import firebase from 'firebase';
import { isIphoneX } from 'react-native-iphone-x-helper';

export default function LoginScreen({ navigation }) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');  

  const dispatch = useDispatch();

  const login = async () => {

    Keyboard.dismiss();

    addSibling(<Loader />);

    try {  
      const { user } = await firebase.auth().signInWithEmailAndPassword(email, password);
      const snap = firebase.firestore().collection('users').doc(user.uid).get();
      const data = (await snap).data();
      
      dispatch(setUser({
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoUrl: user.photoURL,
        jobTitle: data?.jobTitle,
        resumeUrl: data?.resumeUrl,
        location: {
          longitude: data?.location?.coords?.longitude,
          latitude: data?.location?.coords?.latitude  
        },
        type: data?.type,
        aboutMe: data?.aboutMe
      }));
      
      navigation.navigate('Tab');
      destroySibling();
    } catch (err) {
      showToast(err.message);
      destroySibling();
    }
  }

  return (
    <KeyboardAvoidingView keyboardVerticalOffset={-100} enabled behavior='position' style = {styles.container}>

      {/* Logo */}
      <Image 
        style = {styles.image} 
        resizeMode='contain' source={require('../../assets/logo.png')} 
      />

      {/* Register inputs */}  
      <View style = {styles.inputsWrapper}>
        <Input 
          value={email} 
          onChange={(e) => setEmail(e)} 
          placeholder='Enter your email' 
        />
        <Input 
          secureTextEntry
          value={password} 
          onChange={(p) => setPassword(p)} 
          placeholder='Enter your password' 
        />

        <Breaker />

        {/* Button */}
        <Button onPress={login} text='Login Now' />

        {/* footer txt */}
        <Text onPress={() => navigation.navigate('Register')} style={styles.text}>Don't have an account? Sign Up</Text>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: '#000000'
   },
   inputsWrapper: {
     marginTop: '15%',
     padding: '4%',
   },
   text: {
    color: '#158340',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: hp('1.3%'),
    fontSize: hp('2%') 
  },
   image: {
     width: '100%',
     height: '25%',
     marginTop: isIphoneX() ? '40%' : '30%',
   }  
})