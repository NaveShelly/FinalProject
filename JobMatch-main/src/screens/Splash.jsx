import { View, StyleSheet, Image } from 'react-native';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/user';
import React, { useEffect } from 'react';

import firebase from 'firebase';

export default function SplashScreen({ navigation }) {

  const dispatch = useDispatch();

  useEffect(() => {
    const unsubsribe = firebase
    .auth()
    .onAuthStateChanged(async(user) => {
       if (user) {
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
            longitude: data?.location?.coords?.longitude || null,
            latitude: data?.location?.coords?.latitude || null  
          },
          type: data?.type,
          aboutMe: data?.aboutMe 
        })); 
        navigation.navigate('Tab'); 
       } else {
           setTimeout(() => {
              navigation.navigate('Register'); 
           }, 4000)
       } 
    })

    return () => {
       unsubsribe();
    }
 }, []);

  return (
    <View style={styles.container}>
      <Image 
        resizeMode='contain' 
        style={styles.image}
        source={require('../../assets/logo.png')} 
      />
    </View>
  )
}

const styles = StyleSheet.create({
   container: {
     flex: 1,
     alignItems: 'center',
     justifyContent: 'center',
     backgroundColor: '#000000'  
   },
   image: {
     width: '100%',
     height: '30%'
   }
});