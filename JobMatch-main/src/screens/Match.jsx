import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'

export default function Match() {

  const navigation = useNavigation();
  const { params } = useRoute();

  const { loggedInProfile, userSwiped } = params;

  console.log('user data', loggedInProfile);
  console.log('user swiped data', userSwiped);

  return (
    <View style={styles.container}>
      <Image resizeMode='contain' style={styles.image} source={require('../../assets/images/match.png')} />

      <Text style={styles.txt}>You and {userSwiped.username} liked each other</Text>

      <View style={styles.row}>
         <Image style={styles.avatar} source={{ uri: loggedInProfile.photoUrl }} />
         <Image style={styles.avatar} source={{ uri: userSwiped.uri }} />
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Chat')} style={styles.btn}>
        <Text>Send Message</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000000',
      alignItems: 'center',
      paddingTop: '30%'
    },
    image: {
      width: '80%',
      height: '25%'
    },
    txt: {
      fontSize: 17,
      fontWeight: '500'  
    },
    row: {
       flexDirection: 'row',
       width: '80%',
       justifyContent: 'space-evenly',
       marginTop: '10%'
    },
    avatar: {
       width: 120,
       height: 120,
       borderRadius: 120/2
    },
    btn: {
       width: '70%',
       height: '8%',
       borderRadius: 20,
       backgroundColor: '#fff',
       alignItems: 'center',
       justifyContent: 'center',
       marginTop: '15%'
    }
 })