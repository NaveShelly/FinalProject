import { SafeAreaView, Text, StyleSheet, View, FlatList } from 'react-native';
import { ChatRow } from '../components';
import { Feather } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import firebase from 'firebase';

export default function Chat() {

  const [matches, setMatches] = useState([]);

  const navigation = useNavigation();  

  const { user } = useSelector((state) => state.user);

  useEffect(() => 
    //fetch all matches
    firebase.firestore().collection('matches').where('usersMatched', 'array-contains', user.uid).onSnapshot((snapshot) => setMatches(
       snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
       }))
    )),
  [user]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerWrapper}>
        <Feather onPress={() => navigation.navigate('Home')} name="chevron-left" size={35} color="#228B22" />
        <Text style={styles.chatTxt}>Chat</Text>
      </View>

      {
        matches.length > 0 ? (
          <FlatList
            data={matches}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ChatRow matchDetails={item} />} 
          />  
        ) : (
          <Text style={{color:'#228B22', alignSelf: 'center', fontSize: 22, marginTop: '60%' }}>No matches at the moment 😔</Text>
        )
      }
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000000',
    },
    headerWrapper: {
       flexDirection: 'row',
       alignItems: 'center',
       marginTop: '3%',
       marginLeft: '5%'
    },
    chatTxt: {
       fontSize: 20,
       fontWeight: '500',
       marginLeft: '5%' 
    }
 })