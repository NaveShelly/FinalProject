import { View, Text, StyleSheet, Image, Keyboard, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Breaker, Button, Input, Loader } from '../components';
import { addSibling, destroySibling, showToast } from '../helpers';
import { setUser } from '../store/user';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

import DropDownPicker from 'react-native-dropdown-picker';
import firebase from 'firebase';
import { isIphoneX } from 'react-native-iphone-x-helper';

export default function RegisterScreen({ navigation }) {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {
      label: 'Employee',
      value: 'employee'
    },
    {
      label: 'Employer',
      value: 'employer'
    },
  ])

  

  const dispatch = useDispatch();

  const signUp = async () => {

    Keyboard.dismiss(); 

    if (!username || !value) return showToast('You left some fields empty');

    addSibling(<Loader />);

    try {  
      const { user } = await firebase.auth().createUserWithEmailAndPassword(email, password);
      await firebase.auth().currentUser.updateProfile({
        displayName: username,
        photoURL: 'https://firebasestorage.googleapis.com/v0/b/jobmatch-b6a04.appspot.com/o/profileimage.png?alt=media&token=dc8cfa16-bcc0-444f-98b8-f1eaa4a980e5' 
      });
      await firebase.firestore().collection('users').doc(user.uid).set({
        photoUrl: user.photoURL,
        username: user.displayName,
        id: user.uid,
        type: value,
        ProfileIds: []
      })
      dispatch(setUser({
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoUrl: user.photoURL,
        jobTitle: '',
        resumeUrl: '',
        location: {
          longitude: null,
          latitude: null  
        },
        type: value, 
        ProfileIds: []
      }));
      destroySibling();
      navigation.navigate('SetProfile');
    } catch (err) {
      showToast(err.message);
      destroySibling();
    }
  }

  return (
    <KeyboardAvoidingView keyboardVerticalOffset={-50} enabled behavior='position' style = {styles.container}>

      {/* Logo */}
      <Image 
        style = {styles.image} 
        resizeMode='contain' source={require('../../assets/logo.png')} 
      />

      {/* Register inputs */}  
      <View style = {styles.inputsWrapper}>
        <Input 
          value={username} 
          onChange={(u) => setUsername(u)} 
          placeholder='Enter your username' 
        />
        <Input 
          value={email} 
          onChange={(e) => setEmail(e)}  
          placeholder='Enter your email' 
        />
        <Input 
          secureTextEntry
          value={password} 
          onChange={(p) => setPassword(p)}  
          placeholder='Pick a strong password' 
        />
        <DropDownPicker 
          open={open} 
          items={items}
          setOpen={setOpen}
          value={value}
          setValue={setValue}
          setItems={setItems}
          placeholder="Select a job type"
        />

        <Breaker />

        {/* Button */}
        <Button text='Sign Up Now' onPress={signUp} />

        {/* footer txt */}
        <Text onPress={() => navigation.navigate('Login')} style={styles.text}>Already have an account? Login</Text>
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
     width: wp('100%'),
     height: hp('25%'),
     marginTop: isIphoneX() ? '30%' : '25%',
   }  
})