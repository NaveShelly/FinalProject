import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux';
import { getMatchedUserInfo } from '../helpers';

export default function ChatRow({ matchDetails }) {

  const [matchedUserInfo, setMatchedUserInfo] = useState(null);

  useEffect(() => {
    setMatchedUserInfo(getMatchedUserInfo(matchDetails.users, user.uid)); 
  }, [matchDetails, user]);

  const navigation = useNavigation();
  const { user } = useSelector((state) => state.user);

  return (
    <TouchableOpacity onPress={() => navigation.navigate('Message', { matchDetails })} style={styles.container}>
       <Image source={{ uri: matchedUserInfo?.photoUrl || matchedUserInfo?.uri }} style={styles.image} />

       <View style={styles.infoWrapper}>
          <Text style={styles.nameTxt}>{matchedUserInfo?.displayName || matchedUserInfo?.username}</Text>
          <Text>Hi there, how you doing</Text> 
       </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
   container: {
     backgroundColor: '#228B22',
     flexDirection: 'row',
     alignItems: 'center',
     width: '88%',
     alignSelf: 'center',
     paddingVertical: '5%',
     paddingHorizontal: '5%',
     borderRadius: 10,
     marginTop: '5%',
   }, 
   infoWrapper: {
     marginLeft: '6%' 
   },
   nameTxt: {
     fontSize: 20,
     fontWeight: 'bold',
     marginBottom: '3%'
   },
   image: {
     width: 50,
     height: 50,
     borderRadius: 50/2
   } 
})