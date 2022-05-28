import { View, Text, StyleSheet, SafeAreaView, TextInput, Image, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, FlatList, Keyboard, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { SenderMessage, ReceiverMessage } from '../components';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getMatchedUserInfo } from '../helpers';
import { useSelector } from 'react-redux';

import ImageView from "react-native-image-viewing";
import firebase from 'firebase';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { isIphoneX } from 'react-native-iphone-x-helper';

export default function Message() {

  const [message, setMessage] = useState('');  
  const [messages, setMessages] = useState([]);
  const [visible, setIsVisible] = useState(false);

  const navigation = useNavigation();
  const { user } = useSelector((state) => state.user);

  const { params } = useRoute();
  const { matchDetails } = params;

  useEffect(() => 
    firebase.firestore().collection('matches').doc(matchDetails.id).collection('messages').orderBy('timestamp', 'desc').onSnapshot((snapshot) => setMessages(
       snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data() 
       })) 
    )),
  []);

  const sendMessage = () => {
     firebase.firestore().collection('matches').doc(matchDetails.id).collection('messages').add({
       timestamp: firebase.firestore.FieldValue.serverTimestamp(),
       userId: user.uid,
       displayName: user.displayName,
       photoURL: matchDetails.users[user.uid].photoUrl || matchDetails.users[user.uid].uri,
       message: message  
     })

     setMessage('');
  };

  //console.log('info',getMatchedUserInfo(matchDetails?.users, user.uid));

  return (
    <SafeAreaView style={styles.container}>

      <ImageView
         images={[{ uri: getMatchedUserInfo(matchDetails?.users, user.uid).resumeUrl }]}
         imageIndex={0}
         visible={visible}
         onRequestClose={() => setIsVisible(false)}
      />

      <View style={styles.headerWrapper}>
        <Feather onPress={() => navigation.goBack()} name="chevron-left" size={35} color='#228B22' />
        <Text style={styles.chatTxt}>{getMatchedUserInfo(matchDetails?.users, user.uid).username || getMatchedUserInfo(matchDetails?.users, user.uid).displayName}</Text>
      </View>

      {
         getMatchedUserInfo(matchDetails?.users, user.uid).type === 'employee' && (
          <TouchableOpacity style={styles.resumeWrapper} onPress={() => setIsVisible(true)}>
            <Image source={{ uri: getMatchedUserInfo(matchDetails?.users, user.uid).resumeUrl }} style={styles.resumeImage} />
          </TouchableOpacity>
         )
      }

      <KeyboardAvoidingView
         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
         style={{ flex: 1 }}
         keyboardVerticalOffset={10}
        >

       <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
           <FlatList
             style={{ paddingHorizontal: '5%', paddingVertical: '5%' }}
             inverted={-1}
             data={messages} 
             keyExtractor={(item) => item.id}
             renderItem={({ item: message }) => {
               if (message.userId ===  user.uid) {
                  return <SenderMessage key={message.id} message={message} />
               } else {
                  return <ReceiverMessage key={message.id} message={message} />
               }
             }}
           />
       </TouchableWithoutFeedback>

      <View style={styles.messageWrapper}>
         <TextInput 
           color='#000000' 
           value={message}
           style={styles.input}
           placeholder="Send Message..."
           onChangeText={(m) => setMessage(m)}
         />

         <Feather onPress={sendMessage} name="send" size={24} color='#228B22' />
      </View>

      </KeyboardAvoidingView>

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
       marginTop: isIphoneX() ? hp('3%') : hp('6%'),
       marginLeft: hp('3%')
    },
    messageWrapper: {
       flexDirection: 'row',
       justifyContent: 'space-between',
       height: 63,
       alignItems: 'center',
       paddingHorizontal: '5%',
       marginHorizontal: '5%',
       borderRadius: 20,
       paddingVertical: '5%',
       backgroundColor: '#fff',
    },
    chatTxt: {
       color:'#228B22',
       fontSize: 20,
       fontWeight: '500',
       marginLeft: '5%' 
    },
    input: {
       height: 20,
       width: '80%',
       paddingLeft: '3%',
       fontSize: 18
    },
    resumeWrapper: { 
       alignSelf: 'center',
       width: 160, 
       height: 160,
       marginTop: hp('5%') 
    },
    resumeImage: {
       flex: 1,
       borderRadius: 20,
       left:130,
       bottom:130,
       width: 120,
       height: 120,
       resizeMode: 'contain'
    }
})